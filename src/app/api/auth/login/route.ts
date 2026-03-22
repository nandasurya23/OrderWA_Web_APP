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
import { resolveEffectiveSellerPlan } from "@/server/config/seller-plan";
import { ACCOUNT_ROLE, resolveAccountRole } from "@/server/auth/roles";

const loginRequestSchema = loginSchema
  .extend({
    expectedRole: z.enum(["SELLER", "ADMIN"]).optional(),
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

    const role = resolveAccountRole(account.role);
    if (body.expectedRole && role !== body.expectedRole) {
      throw new HttpError(
        body.expectedRole === "ADMIN"
          ? "Akun ini bukan admin."
          : "Akun ini bukan seller.",
        {
          code: "AUTH_ROLE_MISMATCH",
          fieldErrors: {
            email:
              body.expectedRole === "ADMIN"
                ? "Gunakan akun admin untuk login admin."
                : "Gunakan akun seller untuk login seller.",
          },
          status: 403,
        },
      );
    }
    const profile =
      role === ACCOUNT_ROLE.SELLER
        ? await findSellerProfileBySellerId(account.id)
        : null;

    if (role === ACCOUNT_ROLE.SELLER && !profile) {
      throw new HttpError("Profil seller tidak ditemukan", {
        code: "NOT_FOUND",
        status: 404,
      });
    }

    const session = await createSellerSession(account.id);
    const response = ok({
      seller: {
        destinationPhoneNumber: profile?.destinationPhoneNumber ?? null,
        email: account.email,
        plan: resolveEffectiveSellerPlan({
          plan: account.plan,
          proValidUntil: account.proValidUntil,
        }),
        proValidUntil: account.proValidUntil?.toISOString() ?? null,
        role,
        sellerId: account.id,
        sellerName: account.sellerName,
        storeName: profile?.storeName ?? null,
      },
      redirectPath: role === ACCOUNT_ROLE.ADMIN ? "/admin" : "/seller/setup",
    }, 200, context);

    setSessionCookie(response, session.rawToken, session.expiresAt, role);
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
