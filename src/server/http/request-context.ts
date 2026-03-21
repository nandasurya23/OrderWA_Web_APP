import { randomUUID } from "crypto";

import type { NextRequest } from "next/server";

export type RequestContext = {
  ip: string;
  method: string;
  path: string;
  requestId: string;
  userAgent: string;
};

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export function createRequestContext(request: NextRequest): RequestContext {
  const requestId = request.headers.get("x-request-id") ?? randomUUID();

  return {
    ip: getClientIp(request),
    method: request.method,
    path: request.nextUrl.pathname,
    requestId,
    userAgent: request.headers.get("user-agent") ?? "unknown",
  };
}
