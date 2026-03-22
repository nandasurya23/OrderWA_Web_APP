import { NextRequest } from "next/server";

import { requireSellerSession } from "@/server/auth/guards";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { logAuditEvent } from "@/server/observability/audit-log";
import { enforceRateLimit } from "@/server/security/rate-limit";
import {
  createProUpgradeRequestForSeller,
  getPendingProUpgradeRequestForSeller,
} from "@/server/services/seller-upgrade.service";

export async function GET(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "seller:upgrade:get",
      limit: 60,
      request,
      windowMs: 60 * 1000,
    });

    const sellerId = await requireSellerSession(request);
    const requestData = await getPendingProUpgradeRequestForSeller(sellerId);

    return ok(
      {
        data: requestData
          ? {
              id: requestData.id,
              status: requestData.status,
              planCode: requestData.planCode,
              priceAmount: requestData.priceAmount,
              currency: requestData.currency,
              createdAt: requestData.createdAt.toISOString(),
            }
          : null,
      },
      200,
      context,
    );
  } catch (error) {
    return toErrorResponse(error, context);
  }
}

export async function POST(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "seller:upgrade:create",
      limit: 20,
      request,
      windowMs: 60 * 1000,
    });

    const sellerId = await requireSellerSession(request);
    const result = await createProUpgradeRequestForSeller(sellerId);

    logAuditEvent({
      action: result.created
        ? "seller.upgrade-request.created"
        : "seller.upgrade-request.reused",
      metadata: {
        ip: context.ip,
        requestId: result.request.id,
      },
      requestId: context.requestId,
      sellerId,
    });

    return ok(
      {
        data: {
          created: result.created,
          request: {
            id: result.request.id,
            status: result.request.status,
            planCode: result.request.planCode,
            priceAmount: result.request.priceAmount,
            currency: result.request.currency,
            createdAt: result.request.createdAt.toISOString(),
          },
        },
      },
      result.created ? 201 : 200,
      context,
    );
  } catch (error) {
    return toErrorResponse(error, context);
  }
}
