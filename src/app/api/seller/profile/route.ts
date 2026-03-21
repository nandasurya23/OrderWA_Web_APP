import { NextRequest } from "next/server";
import { z } from "zod";

import {
  sellerProfileSchema,
  type SellerProfileValues,
} from "@/features/seller-profile/schemas/seller-profile.schema";
import { requireSellerSession } from "@/server/auth/guards";
import { HttpError } from "@/server/http/errors";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { toValidationHttpError } from "@/server/http/validation";
import { logAuditEvent } from "@/server/observability/audit-log";
import { generateUniqueStoreSlug } from "@/server/lib/store-slug";
import {
  findSellerAccountByEmail,
  findSellerAccountById,
  updateSellerAccountIdentity,
} from "@/server/repositories/seller-account.repo";
import {
  findSellerProfileBySellerId,
  updateSellerProfileBySellerId,
} from "@/server/repositories/seller-profile.repo";
import { enforceRateLimit } from "@/server/security/rate-limit";

const sellerProfileRequestSchema = sellerProfileSchema.strict();

function mapProfileResponse(
  sellerId: string,
  account: { email: string; sellerName: string },
  profile: {
    destinationPhoneNumber: string;
    storeSlug: string;
    storeDescription: string;
    storeName: string;
  },
) {
  return {
    profile: {
      destinationPhoneNumber: profile.destinationPhoneNumber,
      email: account.email,
      sellerId,
      sellerName: account.sellerName,
      storeSlug: profile.storeSlug,
      storeDescription: profile.storeDescription,
      storeName: profile.storeName,
    },
  };
}

export async function GET(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "seller:profile:get",
      limit: 80,
      request,
      windowMs: 60 * 1000,
    });

    const sellerId = await requireSellerSession(request);
    const [account, profile] = await Promise.all([
      findSellerAccountById(sellerId),
      findSellerProfileBySellerId(sellerId),
    ]);

    if (!account || !profile) {
      throw new HttpError("Profil seller belum tersedia", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return ok(mapProfileResponse(sellerId, account, profile), 200, context);
  } catch (error) {
    return toErrorResponse(error, context);
  }
}

export async function PUT(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "seller:profile:update",
      limit: 20,
      request,
      windowMs: 60 * 1000,
    });

    const sellerId = await requireSellerSession(request);
    const body = sellerProfileRequestSchema.parse(await request.json()) as SellerProfileValues;
    const normalizedEmail = body.email.trim().toLowerCase();
    const duplicated = await findSellerAccountByEmail(normalizedEmail);

    if (duplicated && duplicated.id !== sellerId) {
      throw new HttpError("Email sudah dipakai seller lain", {
        code: "EMAIL_TAKEN",
        fieldErrors: {
          email: "Gunakan email lain karena email ini sudah terdaftar.",
        },
        status: 409,
      });
    }

    const nextStoreName = body.storeName.trim();
    const nextStoreSlug = await generateUniqueStoreSlug({
      sellerId,
      storeName: nextStoreName,
    });

    const [account, profile] = await Promise.all([
      updateSellerAccountIdentity(sellerId, {
        email: normalizedEmail,
        sellerName: body.sellerName.trim(),
      }),
      updateSellerProfileBySellerId(sellerId, {
        destinationPhoneNumber: body.destinationPhoneNumber,
        storeDescription: body.storeDescription.trim(),
        storeName: nextStoreName,
        storeSlug: nextStoreSlug,
      }),
    ]);

    logAuditEvent({
      action: "seller.profile.updated",
      metadata: {
        ip: context.ip,
      },
      requestId: context.requestId,
      sellerId,
    });

    return ok(mapProfileResponse(sellerId, account, profile), 200, context);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return toErrorResponse(toValidationHttpError(error), context);
    }

    return toErrorResponse(error, context);
  }
}
