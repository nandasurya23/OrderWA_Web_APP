import { NextRequest } from "next/server";

import {
  AUTH_SESSION_COOKIE_NAME,
  clearSessionCookie,
  getSessionSellerId,
  revokeSessionByCookieToken,
} from "@/server/auth/session";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { logAuditEvent } from "@/server/observability/audit-log";

export async function POST(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    const sellerId = await getSessionSellerId(request);
    const rawToken = request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value;
    await revokeSessionByCookieToken(rawToken);

    const response = ok({
      ok: true,
    }, 200, context);

    clearSessionCookie(response);
    logAuditEvent({
      action: "auth.logout",
      metadata: {
        ip: context.ip,
      },
      requestId: context.requestId,
      sellerId: sellerId ?? undefined,
    });
    return response;
  } catch (error) {
    return toErrorResponse(error, context);
  }
}
