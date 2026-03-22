import { NextRequest } from "next/server";

import { getSessionSellerId } from "@/server/auth/session";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { findSellerAccountById } from "@/server/repositories/seller-account.repo";
import { findSellerProfileBySellerId } from "@/server/repositories/seller-profile.repo";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { resolveEffectiveSellerPlan } from "@/server/config/seller-plan";
import { ACCOUNT_ROLE, resolveAccountRole } from "@/server/auth/roles";

export async function GET(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "auth:me",
      limit: 60,
      request,
      windowMs: 60 * 1000,
    });

    const sellerId = await getSessionSellerId(request, ACCOUNT_ROLE.SELLER);

    if (!sellerId) {
      return ok({ seller: null }, 200, context);
    }

    const account = await findSellerAccountById(sellerId);
    if (!account) {
      return ok({ seller: null }, 200, context);
    }

    const role = resolveAccountRole(account.role);
    const profile =
      role === ACCOUNT_ROLE.SELLER
        ? await findSellerProfileBySellerId(sellerId)
        : null;

    if (role === ACCOUNT_ROLE.SELLER && !profile) {
      return ok({ seller: null }, 200, context);
    }

    return ok({
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
    }, 200, context);
  } catch (error) {
    return toErrorResponse(error, context);
  }
}
