import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { prisma } from "@/server/db/prisma";

export const AUTH_SESSION_COOKIE_NAME = "orderwa_seller_session";
const AUTH_SESSION_TTL_DAYS = 30;

function hashToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

function createRawToken() {
  return randomBytes(32).toString("base64url");
}

export async function createSellerSession(sellerId: string) {
  const rawToken = createRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(
    Date.now() + AUTH_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  await prisma.authSession.create({
    data: {
      sellerId,
      tokenHash,
      expiresAt,
    },
  });

  return {
    expiresAt,
    rawToken,
  };
}

export function setSessionCookie(response: NextResponse, rawToken: string, expiresAt: Date) {
  response.cookies.set(AUTH_SESSION_COOKIE_NAME, rawToken, {
    expires: expiresAt,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(AUTH_SESSION_COOKIE_NAME, "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getSessionSellerId(request: NextRequest) {
  const rawToken = request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value;

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
