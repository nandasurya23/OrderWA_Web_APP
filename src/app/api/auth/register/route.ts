import { NextRequest } from "next/server";
import { z } from "zod";

import { DEFAULT_SELLER_ORDER_CONFIG } from "@/features/shared-order/constants/order.constants";
import { hashPassword } from "@/server/auth/password";
import {
  createSellerSession,
  setSessionCookie,
} from "@/server/auth/session";
import { HttpError } from "@/server/http/errors";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { toValidationHttpError } from "@/server/http/validation";
import { logAuditEvent } from "@/server/observability/audit-log";
import { generateUniqueStoreSlug } from "@/server/lib/store-slug";
import {
  createSellerAccount,
  findSellerAccountByEmail,
} from "@/server/repositories/seller-account.repo";
import { createSellerOrderConfig } from "@/server/repositories/seller-order-config.repo";
import { createSellerProfile } from "@/server/repositories/seller-profile.repo";
import { enforceRateLimit } from "@/server/security/rate-limit";

const registerRequestSchema = z
  .object({
    sellerName: z.string().trim().min(2, "Nama seller minimal 2 karakter").max(80),
    email: z
      .string()
      .trim()
      .min(1, "Email wajib diisi")
      .email("Masukkan email yang valid"),
    password: z.string().min(6, "Kata sandi minimal 6 karakter").max(72),
    confirmPassword: z.string().min(6, "Ulangi kata sandi kamu").max(72),
  })
  .strict()
  .refine((values) => values.password === values.confirmPassword, {
    message: "Kata sandi belum sama",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "auth:register",
      limit: 8,
      request,
      windowMs: 10 * 60 * 1000,
    });

    const body = registerRequestSchema.parse(await request.json());
    const email = body.email.trim().toLowerCase();
    const existingAccount = await findSellerAccountByEmail(email);

    if (existingAccount) {
      throw new HttpError("Email sudah terdaftar", {
        code: "EMAIL_TAKEN",
        fieldErrors: {
          email: "Email ini sudah dipakai. Coba masuk atau gunakan email lain.",
        },
        status: 409,
      });
    }

    const account = await createSellerAccount({
      email,
      passwordHash: hashPassword(body.password),
      sellerName: body.sellerName.trim(),
    });
    const initialStoreName = account.sellerName;
    const storeSlug = await generateUniqueStoreSlug({
      sellerId: account.id,
      storeName: initialStoreName,
    });

    await createSellerProfile({
      destinationPhoneNumber: "",
      sellerId: account.id,
      storeSlug,
      storeDescription: "",
      storeName: initialStoreName,
    });

    await createSellerOrderConfig({
      closingText: DEFAULT_SELLER_ORDER_CONFIG.closingText,
      openingText: DEFAULT_SELLER_ORDER_CONFIG.openingText,
      sellerId: account.id,
      showAddress: DEFAULT_SELLER_ORDER_CONFIG.showAddress,
      showNote: DEFAULT_SELLER_ORDER_CONFIG.showNote,
      showPhoneNumber: DEFAULT_SELLER_ORDER_CONFIG.showPhoneNumber,
    });

    const session = await createSellerSession(account.id);
    const response = ok({
      seller: {
        destinationPhoneNumber: "",
        email: account.email,
        sellerId: account.id,
        sellerName: account.sellerName,
        storeName: account.sellerName,
      },
    }, 200, context);

    setSessionCookie(response, session.rawToken, session.expiresAt);
    logAuditEvent({
      action: "auth.register.success",
      metadata: {
        email,
        ip: context.ip,
      },
      requestId: context.requestId,
      sellerId: account.id,
    });
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      logAuditEvent({
        action: "auth.register.failed",
        level: "warn",
        metadata: {
          code: error.code,
          ip: context.ip,
        },
        requestId: context.requestId,
      });
    }

    if (error instanceof z.ZodError) {
      return toErrorResponse(toValidationHttpError(error), context);
    }

    return toErrorResponse(error, context);
  }
}
