import { NextRequest } from "next/server";

import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { logAuditEvent } from "@/server/observability/audit-log";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { resolvePublicOrderConfigByStoreSlug } from "@/server/services/public-order-link.service";

type RouteContext = {
  params: Promise<{
    storeSlug: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const requestContext = createRequestContext(request);

  try {
    enforceRateLimit({
      key: "public:order-config:get",
      limit: 120,
      request,
      windowMs: 60 * 1000,
    });

    const params = await context.params;
    const payload = await resolvePublicOrderConfigByStoreSlug(params.storeSlug);
    return ok({ data: payload }, 200, requestContext);
  } catch (error) {
    logAuditEvent({
      action: "public.order-config.resolve.failed",
      level: "warn",
      metadata: {
        ip: requestContext.ip,
      },
      requestId: requestContext.requestId,
    });
    return toErrorResponse(error, requestContext);
  }
}
