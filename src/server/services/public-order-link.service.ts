import { randomBytes } from "crypto";
import { z } from "zod";

import { prisma } from "@/server/db/prisma";
import { HttpError } from "@/server/http/errors";
import {
  createPublicOrderLink,
  findPublicOrderLinkById,
  findLatestPublicLinkBySellerId,
  findRecentPublicLinksBySellerId,
  updatePublicOrderLinkById,
} from "@/server/repositories/public-order-link.repo";
import {
  isValidWhatsAppPhoneNumber,
  normalizePhoneNumber,
} from "@/features/shared-order/lib/normalize-phone-number";
import type { SellerOrderConfig } from "@/features/shared-order/types/order.types";
import {
  findSellerProfileBySellerId,
  findSellerProfileByStoreSlug,
} from "@/server/repositories/seller-profile.repo";
import { getSellerPlanPolicyBySellerId } from "@/server/services/seller-plan.service";

const snapshotConfigSchema = z.object({
  openingText: z.string().trim().min(1).max(120),
  closingText: z.string().trim().min(1).max(140),
  showPhoneNumber: z.boolean(),
  showAddress: z.boolean(),
  showNote: z.boolean(),
  customFields: z.array(
    z.object({
      id: z.string().trim().min(1).max(64),
      type: z.enum(["text", "textarea"]),
      required: z.boolean(),
      label: z.string().trim().min(1).max(60),
      placeholder: z.string().trim().max(120),
    }).strict(),
  ).max(10).default([]),
  fieldOrder: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
  destinationPhoneNumber: z.string().trim().min(10).max(20),
}).strict();

const updateOrderLinkSchema = z
  .object({
    expiresAt: z.string().datetime().nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((value) => value.expiresAt !== undefined || value.isActive !== undefined, {
    message: "Tidak ada perubahan yang dikirim.",
    path: ["form"],
  });

function generatePublicToken() {
  return randomBytes(18).toString("base64url");
}

function buildPublicOrderSlugUrl(origin: string, storeSlug: string) {
  return `${origin}/konfirmasi-pesanan/${encodeURIComponent(storeSlug)}`;
}

function sanitizeSnapshotConfig(
  input: z.infer<typeof snapshotConfigSchema>,
): SellerOrderConfig {
  const destinationPhoneNumber = normalizePhoneNumber(input.destinationPhoneNumber);

  if (!isValidWhatsAppPhoneNumber(destinationPhoneNumber)) {
    throw new HttpError("Nomor WhatsApp tujuan belum valid.", {
      code: "INVALID_DESTINATION_PHONE",
      fieldErrors: {
        destinationPhoneNumber: "Nomor WhatsApp tujuan belum valid.",
      },
      status: 400,
    });
  }

  return {
    closingText: input.closingText.trim(),
    destinationPhoneNumber,
    openingText: input.openingText.trim(),
    showAddress: input.showAddress,
    showNote: input.showNote,
    showPhoneNumber: input.showPhoneNumber,
    customFields: input.customFields.map((field) => ({
      id: field.id.trim(),
      type: field.type,
      required: field.required,
      label: field.label.trim(),
      placeholder: field.placeholder.trim(),
    })),
    fieldOrder: input.fieldOrder,
  };
}

export async function createPublicOrderLinkWithSnapshot(input: {
  origin: string;
  sellerId: string;
  snapshotConfig: unknown;
}) {
  const parsedConfig = snapshotConfigSchema.parse(input.snapshotConfig);
  const config = sanitizeSnapshotConfig(parsedConfig);

  const profile = await findSellerProfileBySellerId(input.sellerId);

  if (!profile) {
    throw new HttpError("Profil seller tidak ditemukan.", {
      code: "NOT_FOUND",
      status: 404,
    });
  }

  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${input.sellerId}))`;
    const dbNowRows = await tx.$queryRaw<Array<{ now: Date }>>`SELECT now() as now`;
    const now = dbNowRows[0]?.now ?? new Date();
    const planPolicy = await getSellerPlanPolicyBySellerId(input.sellerId);
    const linkGenerateWindowMs = planPolicy.linkGenerateWindowMs;
    const linkExpiryMs = planPolicy.linkExpiryMs;

    const latestLink = await findLatestPublicLinkBySellerId(input.sellerId, tx);

    if (latestLink && linkGenerateWindowMs > 0) {
      const nextAvailableAt = new Date(
        latestLink.createdAt.getTime() + linkGenerateWindowMs,
      );

      if (nextAvailableAt > now) {
        throw new HttpError("Free plan hanya bisa membuat 1 link tiap 24 jam.", {
          code: "PLAN_LIMIT_REACHED",
          meta: {
            existingLink: {
              createdAt: latestLink.createdAt.toISOString(),
              expiresAt: latestLink.expiresAt?.toISOString() ?? null,
              id: latestLink.id,
              isActive: latestLink.isActive,
              url: buildPublicOrderSlugUrl(input.origin, profile.storeSlug),
            },
            nextAvailableAt: nextAvailableAt.toISOString(),
          },
          status: 409,
        });
      }
    }

    const expiresAt = new Date(now.getTime() + linkExpiryMs);

    const link = await createPublicOrderLink(
      {
        configSnapshotJson: config,
        createdAt: now,
        expiresAt,
        sellerId: input.sellerId,
        token: generatePublicToken(),
      },
      tx,
    );

    return {
      createdAt: link.createdAt,
      expiresAt: link.expiresAt ?? expiresAt,
      id: link.id,
      isActive: link.isActive,
      url: buildPublicOrderSlugUrl(input.origin, profile.storeSlug),
    };
  });
}

export async function getLatestPublicOrderLinkStatus(input: {
  origin: string;
  sellerId: string;
}) {
  const dbNowRows = await prisma.$queryRaw<Array<{ now: Date }>>`SELECT now() as now`;
  const now = dbNowRows[0]?.now ?? new Date();
  const planPolicy = await getSellerPlanPolicyBySellerId(input.sellerId);
  const linkGenerateWindowMs = planPolicy.linkGenerateWindowMs;
  const profile = await findSellerProfileBySellerId(input.sellerId);
  const latestLink = await findLatestPublicLinkBySellerId(input.sellerId);
  const recentLinks = await findRecentPublicLinksBySellerId(input.sellerId, 10);

  if (!profile) {
    throw new HttpError("Profil seller tidak ditemukan.", {
      code: "NOT_FOUND",
      status: 404,
    });
  }

  if (!latestLink) {
    return {
      canGenerate: true,
      existingLink: null,
      history: [],
      reusableSnapshot: null,
      nextAvailableAt: null,
    };
  }

  const nextAvailableAt = new Date(latestLink.createdAt.getTime() + linkGenerateWindowMs);
  const latestSnapshotParsed = snapshotConfigSchema.safeParse(latestLink.configSnapshotJson);
  const reusableSnapshot = latestSnapshotParsed.success
    ? sanitizeSnapshotConfig(latestSnapshotParsed.data)
    : null;

  return {
    canGenerate: linkGenerateWindowMs <= 0 ? true : nextAvailableAt <= now,
    existingLink: {
      createdAt: latestLink.createdAt.toISOString(),
      expiresAt: latestLink.expiresAt?.toISOString() ?? null,
      id: latestLink.id,
      isActive: latestLink.isActive,
      url: buildPublicOrderSlugUrl(input.origin, profile.storeSlug),
    },
    history: recentLinks.map((link) => ({
      createdAt: link.createdAt.toISOString(),
      expiresAt: link.expiresAt?.toISOString() ?? null,
      id: link.id,
      status:
        link.isActive && !!link.expiresAt && link.expiresAt > now
          ? "active"
          : "expired",
      url: buildPublicOrderSlugUrl(input.origin, profile.storeSlug),
    })),
    reusableSnapshot,
    nextAvailableAt: linkGenerateWindowMs <= 0 ? null : nextAvailableAt.toISOString(),
  };
}

export async function resolvePublicOrderConfigByStoreSlug(storeSlug: string) {
  const normalizedSlug = storeSlug.trim().toLowerCase();
  const profile = await findSellerProfileByStoreSlug(normalizedSlug);

  if (!profile) {
    throw new HttpError("Link toko tidak ditemukan.", {
      code: "LINK_NOT_FOUND",
      status: 404,
    });
  }

  const dbNowRows = await prisma.$queryRaw<Array<{ now: Date }>>`SELECT now() as now`;
  const now = dbNowRows[0]?.now ?? new Date();
  const link = await findLatestPublicLinkBySellerId(profile.sellerId);

  if (!link) {
    throw new HttpError("Link belum tersedia.", {
      code: "LINK_NOT_FOUND",
      status: 404,
    });
  }

  if (!link.isActive) {
    throw new HttpError("Link sudah tidak aktif.", {
      code: "LINK_INACTIVE",
      status: 410,
    });
  }

  if (!link.expiresAt || link.expiresAt <= now) {
    throw new HttpError("Link sudah kedaluwarsa.", {
      code: "LINK_EXPIRED",
      status: 410,
    });
  }

  const parsedSnapshot = snapshotConfigSchema.safeParse(link.configSnapshotJson);

  if (!parsedSnapshot.success) {
    throw new HttpError("Konfigurasi link tidak valid.", {
      code: "INVALID_CONFIG_SNAPSHOT",
      status: 422,
    });
  }

  const config = sanitizeSnapshotConfig(parsedSnapshot.data);

  return {
    config: {
      closingText: config.closingText,
      openingText: config.openingText,
      showAddress: config.showAddress,
      showNote: config.showNote,
      showPhoneNumber: config.showPhoneNumber,
      customFields: config.customFields,
      fieldOrder: config.fieldOrder,
    },
    seller: {
      destinationPhoneNumber: config.destinationPhoneNumber,
      storeName: profile.storeName,
    },
  };
}

export function parsePublicOrderLinkPatchInput(body: unknown) {
  return updateOrderLinkSchema.parse(body);
}

export async function patchPublicOrderLinkById(input: {
  body: unknown;
  sellerId: string;
  linkId: string;
}) {
  const link = await findPublicOrderLinkById(input.linkId);

  if (!link || link.sellerId !== input.sellerId) {
    throw new HttpError("Link tidak ditemukan.", {
      code: "NOT_FOUND",
      status: 404,
    });
  }

  const parsedBody = parsePublicOrderLinkPatchInput(input.body);
  const nextExpiresAt =
    parsedBody.expiresAt === undefined
      ? undefined
      : parsedBody.expiresAt === null
      ? null
      : new Date(parsedBody.expiresAt);

  if (nextExpiresAt && nextExpiresAt <= new Date()) {
    throw new HttpError("Waktu kedaluwarsa harus di masa depan.", {
      code: "INVALID_EXPIRES_AT",
      fieldErrors: {
        expiresAt: "Waktu kedaluwarsa harus di masa depan.",
      },
      status: 400,
    });
  }

  return updatePublicOrderLinkById(input.linkId, {
    expiresAt: nextExpiresAt,
    isActive: parsedBody.isActive,
  });
}

export async function syncLatestPublicLinkSnapshotForSellerConfig(input: {
  sellerId: string;
  config: {
    openingText: string;
    closingText: string;
    showPhoneNumber: boolean;
    showAddress: boolean;
    showNote: boolean;
    customFields: Array<{
      id: string;
      type: "text" | "textarea";
      required: boolean;
      label: string;
      placeholder: string;
    }>;
    fieldOrder: string[];
  };
}) {
  const latestLink = await findLatestPublicLinkBySellerId(input.sellerId);

  if (!latestLink) {
    return;
  }

  const latestSnapshot = snapshotConfigSchema.safeParse(latestLink.configSnapshotJson);

  if (!latestSnapshot.success) {
    return;
  }

  const nextSnapshot = sanitizeSnapshotConfig({
    ...latestSnapshot.data,
    openingText: input.config.openingText,
    closingText: input.config.closingText,
    showPhoneNumber: input.config.showPhoneNumber,
    showAddress: input.config.showAddress,
    showNote: input.config.showNote,
    customFields: input.config.customFields,
    fieldOrder: input.config.fieldOrder,
  });

  await updatePublicOrderLinkById(latestLink.id, {
    configSnapshotJson: nextSnapshot,
  });
}
