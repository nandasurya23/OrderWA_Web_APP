import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/server/auth/guards";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { toValidationHttpError } from "@/server/http/validation";
import { logAuditEvent } from "@/server/observability/audit-log";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { reviewProUpgradeRequest } from "@/server/services/seller-upgrade.service";

const reviewSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  reviewNote: z.string().trim().max(300).optional(),
}).strict();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const requestContext = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "admin:upgrade-requests:review",
      limit: 40,
      request,
      windowMs: 60 * 1000,
    });
    await requireAdminSession(request);

    const params = await context.params;
    const body = reviewSchema.parse(await request.json());
    const result = await reviewProUpgradeRequest({
      requestId: params.id,
      decision: body.decision,
      reviewNote: body.reviewNote,
    });

    logAuditEvent({
      action: `admin.upgrade-request.${body.decision}`,
      metadata: {
        ip: requestContext.ip,
        requestId: result.request.id,
      },
      requestId: requestContext.requestId,
      sellerId: result.request.sellerId,
    });

    return ok(
      {
        data: {
          request: {
            id: result.request.id,
            sellerId: result.request.sellerId,
            status: result.request.status,
            reviewedAt: result.request.reviewedAt?.toISOString() ?? null,
            reviewNote: result.request.reviewNote,
          },
          sellerPlan: result.sellerPlan
            ? {
                plan: result.sellerPlan.plan,
                proValidUntil: result.sellerPlan.proValidUntil?.toISOString() ?? null,
              }
            : null,
        },
      },
      200,
      requestContext,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return toErrorResponse(toValidationHttpError(error), requestContext);
    }

    return toErrorResponse(error, requestContext);
  }
}
