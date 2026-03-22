import { NextRequest } from "next/server";

import {
  AUTH_ADMIN_SESSION_COOKIE_NAME,
  AUTH_SELLER_SESSION_COOKIE_NAME,
  clearSessionCookie,
  getSessionSellerId,
  revokeSessionByCookieToken,
  resolveRequestedRole,
} from "@/server/auth/session";
import { createRequestContext } from "@/server/http/request-context";
import { ok, toErrorResponse } from "@/server/http/response";
import { logAuditEvent } from "@/server/observability/audit-log";
import { ACCOUNT_ROLE } from "@/server/auth/roles";

export async function POST(request: NextRequest) {
  const context = createRequestContext(request);

  try {
    const body = (await request.json().catch(() => ({}))) as {
      role?: string;
    };
    const role = resolveRequestedRole(body.role);
    const sellerId = await getSessionSellerId(request, role);
    const rawToken = request.cookies.get(
      role === ACCOUNT_ROLE.ADMIN
        ? AUTH_ADMIN_SESSION_COOKIE_NAME
        : AUTH_SELLER_SESSION_COOKIE_NAME,
    )?.value;
    await revokeSessionByCookieToken(rawToken);

    const response = ok({
      ok: true,
    }, 200, context);

    clearSessionCookie(response, role);
    logAuditEvent({
      action: "auth.logout",
      metadata: {
        ip: context.ip,
        role,
      },
      requestId: context.requestId,
      sellerId: sellerId ?? undefined,
    });
    return response;
  } catch (error) {
    return toErrorResponse(error, context);
  }
}
