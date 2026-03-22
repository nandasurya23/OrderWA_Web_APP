import { NextRequest } from "next/server";

import { requireAdminSession } from "@/server/auth/guards";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { getUpgradeRequests } from "@/server/services/seller-upgrade.service";

export async function GET(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "admin:upgrade-requests:list",
      limit: 60,
      request,
      windowMs: 60 * 1000,
    });
    await requireAdminSession(request);

    const rawStatus = request.nextUrl.searchParams.get("status");
    const status =
      rawStatus === "pending" || rawStatus === "approved" || rawStatus === "rejected"
        ? rawStatus
        : undefined;
    const requests = await getUpgradeRequests(status);

    return ok(
      {
        data: requests.map((request) => ({
          id: request.id,
          sellerId: request.sellerId,
          sellerName: request.seller.sellerName,
          storeName: request.seller.profile?.storeName ?? "-",
          sellerEmail: request.seller.email,
          planCode: request.planCode,
          priceAmount: request.priceAmount,
          currency: request.currency,
          status: request.status,
          createdAt: request.createdAt.toISOString(),
          reviewedAt: request.reviewedAt?.toISOString() ?? null,
          reviewNote: request.reviewNote,
        })),
      },
      200,
      context,
    );
  } catch (error) {
    return toErrorResponse(error, context);
  }
}
