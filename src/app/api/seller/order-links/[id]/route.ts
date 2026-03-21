import { NextRequest } from "next/server";
import { z } from "zod";

import { requireSellerSession } from "@/server/auth/guards";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { toValidationHttpError } from "@/server/http/validation";
import { logAuditEvent } from "@/server/observability/audit-log";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { patchPublicOrderLinkById } from "@/server/services/public-order-link.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const requestContext = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "seller:order-links:patch",
      limit: 40,
      request,
      windowMs: 60 * 1000,
    });

    const sellerId = await requireSellerSession(request);
    const params = await context.params;
    const link = await patchPublicOrderLinkById({
      body: await request.json(),
      linkId: params.id,
      sellerId,
    });

    logAuditEvent({
      action: "seller.order-link.updated",
      metadata: {
        ip: requestContext.ip,
        linkId: link.id,
      },
      requestId: requestContext.requestId,
      sellerId,
    });

    return ok({
      link: {
        createdAt: link.createdAt.toISOString(),
        expiresAt: link.expiresAt?.toISOString() ?? null,
        id: link.id,
        isActive: link.isActive,
        token: link.token,
      },
    }, 200, requestContext);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return toErrorResponse(toValidationHttpError(error), requestContext);
    }

    return toErrorResponse(error, requestContext);
  }
}
