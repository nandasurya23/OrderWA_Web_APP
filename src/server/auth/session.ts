import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { prisma } from "@/server/db/prisma";
import { ACCOUNT_ROLE, type AccountRole, resolveAccountRole } from "@/server/auth/roles";

export const AUTH_SELLER_SESSION_COOKIE_NAME = "orderwa_seller_session";
export const AUTH_ADMIN_SESSION_COOKIE_NAME = "orderwa_admin_session";
const AUTH_SESSION_TTL_DAYS = 30;

function hashToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

function createRawToken() {
  return randomBytes(32).toString("base64url");
}

function getSessionCookieName(role: AccountRole) {
  return role === ACCOUNT_ROLE.ADMIN
    ? AUTH_ADMIN_SESSION_COOKIE_NAME
    : AUTH_SELLER_SESSION_COOKIE_NAME;
}

export async function createAccountSession(accountId: string) {
  const rawToken = createRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(
    Date.now() + AUTH_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  await prisma.authSession.create({
    data: {
      sellerId: accountId,
      tokenHash,
      expiresAt,
    },
  });

  return {
    expiresAt,
    rawToken,
  };
}

export async function createSellerSession(sellerId: string) {
  return createAccountSession(sellerId);
}

export function setSessionCookie(
  response: NextResponse,
  rawToken: string,
  expiresAt: Date,
  role: AccountRole = ACCOUNT_ROLE.SELLER,
) {
  response.cookies.set(getSessionCookieName(role), rawToken, {
    expires: expiresAt,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSessionCookie(
  response: NextResponse,
  role: AccountRole = ACCOUNT_ROLE.SELLER,
) {
  response.cookies.set(getSessionCookieName(role), "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function getRoleSessionCookieValue(
  request: NextRequest,
  role: AccountRole,
) {
  return request.cookies.get(getSessionCookieName(role))?.value;
}

export async function getSessionSellerId(
  request: NextRequest,
  role: AccountRole = ACCOUNT_ROLE.SELLER,
) {
  const rawToken = getRoleSessionCookieValue(request, role);
  return getSessionSellerIdFromRawToken(rawToken);
}

export async function getSessionSellerIdFromRawToken(rawToken?: string) {
  if (!rawToken) {
    return null;
  }

  const tokenHash = hashToken(rawToken);
  const session = await prisma.authSession.findUnique({
    where: {
      tokenHash,
    },
    select: {
      expiresAt: true,
      revokedAt: true,
      sellerId: true,
      tokenHash: true,
    },
  });

  if (!session || session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  const isMatching =
    session.tokenHash.length === tokenHash.length &&
    timingSafeEqual(Buffer.from(session.tokenHash), Buffer.from(tokenHash));

  if (!isMatching) {
    return null;
  }

  return session.sellerId;
}

export async function revokeSessionByCookieToken(rawToken?: string) {
  if (!rawToken) {
    return;
  }

  const tokenHash = hashToken(rawToken);
  await prisma.authSession.updateMany({
    data: {
      revokedAt: new Date(),
    },
    where: {
      revokedAt: null,
      tokenHash,
    },
  });
}

export function resolveRequestedRole(input?: string | null): AccountRole {
  return resolveAccountRole(input);
}
