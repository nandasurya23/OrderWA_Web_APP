import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_SESSION_COOKIE_NAME } from "@/server/auth/session";

function isProtectedSellerPath(pathname: string) {
  return pathname === "/seller" || pathname.startsWith("/seller/");
}

function isAuthPath(pathname: string) {
  return pathname === "/auth/login" || pathname === "/auth/register";
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const hasSession = Boolean(
    request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value,
  );
  const safeNextPath = (value: string | null) =>
    value && value.startsWith("/") ? value : null;

  if (isProtectedSellerPath(pathname) && !hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath(pathname) && hasSession) {
    const nextPath = safeNextPath(searchParams.get("next"));
    const redirectUrl = new URL(nextPath || "/seller/setup", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/seller/:path*"],
};
