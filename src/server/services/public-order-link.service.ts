import { randomBytes } from "crypto";
import { z } from "zod";

import { prisma } from "@/server/db/prisma";
import { HttpError } from "@/server/http/errors";
import {
  createPublicOrderLink,
  findPublicOrderLinkById,
  findLatestPublicLinkBySellerId,
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

const FREE_PLAN_LINK_WINDOW_MS = 24 * 60 * 60 * 1000;

const snapshotConfigSchema = z.object({
  openingText: z.string().trim().min(1).max(120),
  closingText: z.string().trim().min(1).max(140),
  showPhoneNumber: z.boolean(),
  showAddress: z.boolean(),
  showNote: z.boolean(),
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

    const latestLink = await findLatestPublicLinkBySellerId(input.sellerId, tx);

    if (latestLink) {
      const nextAvailableAt = new Date(
        latestLink.createdAt.getTime() + FREE_PLAN_LINK_WINDOW_MS,
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

    const expiresAt = new Date(now.getTime() + FREE_PLAN_LINK_WINDOW_MS);

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
  const profile = await findSellerProfileBySellerId(input.sellerId);
  const latestLink = await findLatestPublicLinkBySellerId(input.sellerId);

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
      nextAvailableAt: null,
    };
  }

  const nextAvailableAt = new Date(
    latestLink.createdAt.getTime() + FREE_PLAN_LINK_WINDOW_MS,
  );

  return {
    canGenerate: nextAvailableAt <= now,
    existingLink: {
      createdAt: latestLink.createdAt.toISOString(),
      expiresAt: latestLink.expiresAt?.toISOString() ?? null,
      id: latestLink.id,
      isActive: latestLink.isActive,
      url: buildPublicOrderSlugUrl(input.origin, profile.storeSlug),
    },
    nextAvailableAt: nextAvailableAt.toISOString(),
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
