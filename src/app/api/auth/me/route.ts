import { NextRequest } from "next/server";

import { getSessionSellerId } from "@/server/auth/session";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { findSellerAccountById } from "@/server/repositories/seller-account.repo";
import { findSellerProfileBySellerId } from "@/server/repositories/seller-profile.repo";
import { enforceRateLimit } from "@/server/security/rate-limit";

export async function GET(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "auth:me",
      limit: 60,
      request,
      windowMs: 60 * 1000,
    });

    const sellerId = await getSessionSellerId(request);

    if (!sellerId) {
      return ok({ seller: null }, 200, context);
    }

    const [account, profile] = await Promise.all([
      findSellerAccountById(sellerId),
      findSellerProfileBySellerId(sellerId),
    ]);

    if (!account || !profile) {
      return ok({ seller: null }, 200, context);
    }

    return ok({
      seller: {
        destinationPhoneNumber: profile.destinationPhoneNumber,
        email: account.email,
        sellerId: account.id,
        sellerName: account.sellerName,
        storeName: profile.storeName,
      },
    }, 200, context);
  } catch (error) {
    return toErrorResponse(error, context);
  }
}
