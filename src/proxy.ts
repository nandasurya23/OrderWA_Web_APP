import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  AUTH_ADMIN_SESSION_COOKIE_NAME,
  AUTH_SELLER_SESSION_COOKIE_NAME,
} from "@/server/auth/session";

function isProtectedSellerPath(pathname: string) {
  return pathname === "/seller" || pathname.startsWith("/seller/");
}

function isProtectedAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const hasSellerSession = Boolean(
    request.cookies.get(AUTH_SELLER_SESSION_COOKIE_NAME)?.value,
  );
  const hasAdminSession = Boolean(
    request.cookies.get(AUTH_ADMIN_SESSION_COOKIE_NAME)?.value,
  );
  const hasAnySession = hasSellerSession || hasAdminSession;
  const safeNextPath = (value: string | null) =>
    value && value.startsWith("/") ? value : null;

  if (isProtectedSellerPath(pathname) && !hasSellerSession) {
    const loginUrl = new URL("/auth/seller/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedAdminPath(pathname) && !hasAdminSession) {
    const loginUrl = new URL("/auth/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/auth/admin/login" && hasAdminSession) {
    const nextPath = safeNextPath(searchParams.get("next"));
    const redirectUrl = new URL(
      nextPath ? `/auth/resolve?next=${encodeURIComponent(nextPath)}` : "/auth/resolve",
      request.url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  if ((pathname === "/auth/seller/login" || pathname === "/auth/register") && hasSellerSession) {
    const nextPath = safeNextPath(searchParams.get("next"));
    const redirectUrl = new URL(
      nextPath ? `/auth/resolve?next=${encodeURIComponent(nextPath)}` : "/auth/resolve",
      request.url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/auth/login" && hasAnySession) {
    const nextPath = safeNextPath(searchParams.get("next"));
    const redirectUrl = new URL(
      nextPath ? `/auth/resolve?next=${encodeURIComponent(nextPath)}` : "/auth/resolve",
      request.url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/seller/:path*", "/admin/:path*"],
};
