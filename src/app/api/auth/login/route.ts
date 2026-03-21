import { NextRequest } from "next/server";
import { z } from "zod";

import { loginSchema } from "@/features/auth/schemas/login.schema";
import { verifyPassword } from "@/server/auth/password";
import {
  createSellerSession,
  setSessionCookie,
} from "@/server/auth/session";
import { HttpError } from "@/server/http/errors";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { toValidationHttpError } from "@/server/http/validation";
import { logAuditEvent } from "@/server/observability/audit-log";
import { findSellerAccountByEmail } from "@/server/repositories/seller-account.repo";
import { findSellerProfileBySellerId } from "@/server/repositories/seller-profile.repo";
import { enforceRateLimit } from "@/server/security/rate-limit";

const loginRequestSchema = loginSchema
  .extend({
    password: z.string().min(6, "Kata sandi minimal 6 karakter").max(72),
  })
  .strict();

export async function POST(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "auth:login",
      limit: 10,
      request,
      windowMs: 5 * 60 * 1000,
    });

    const body = loginRequestSchema.parse(await request.json());
    const email = body.email.trim().toLowerCase();
    const account = await findSellerAccountByEmail(email);

    if (!account || !verifyPassword(body.password, account.passwordHash)) {
      throw new HttpError("Email atau kata sandi salah", {
        code: "AUTH_INVALID",
        fieldErrors: {
          email: "Periksa kembali email dan kata sandi kamu.",
        },
        status: 401,
      });
    }

    const profile = await findSellerProfileBySellerId(account.id);

    if (!profile) {
      throw new HttpError("Profil seller tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    const session = await createSellerSession(account.id);
    const response = ok({
      seller: {
        destinationPhoneNumber: profile.destinationPhoneNumber,
        email: account.email,
        sellerId: account.id,
        sellerName: account.sellerName,
        storeName: profile.storeName,
      },
    }, 200, context);

    setSessionCookie(response, session.rawToken, session.expiresAt);
    logAuditEvent({
      action: "auth.login.success",
      metadata: {
        ip: context.ip,
      },
      requestId: context.requestId,
      sellerId: account.id,
    });
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      logAuditEvent({
        action: "auth.login.failed",
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
