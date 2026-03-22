import type { NextRequest } from "next/server";

import { HttpError } from "@/server/http/errors";
import { getSessionSellerId } from "@/server/auth/session";
import { ACCOUNT_ROLE, resolveAccountRole } from "@/server/auth/roles";
import { findSellerAccountById } from "@/server/repositories/seller-account.repo";

export async function requireSellerSession(request: NextRequest) {
  const sellerId = await getSessionSellerId(request, ACCOUNT_ROLE.SELLER);

  if (!sellerId) {
    throw new HttpError("Sesi login sudah berakhir", {
      code: "AUTH_REQUIRED",
      status: 401,
    });
  }

  const account = await findSellerAccountById(sellerId);
  if (!account) {
    throw new HttpError("Akun tidak ditemukan", {
      code: "NOT_FOUND",
      status: 404,
    });
  }

  if (resolveAccountRole(account.role) !== ACCOUNT_ROLE.SELLER) {
    throw new HttpError("Akses hanya untuk seller", {
      code: "FORBIDDEN",
      status: 403,
    });
  }

  return sellerId;
}

export async function requireAdminSession(request: NextRequest) {
  const accountId = await getSessionSellerId(request, ACCOUNT_ROLE.ADMIN);

  if (!accountId) {
    throw new HttpError("Sesi login sudah berakhir", {
      code: "AUTH_REQUIRED",
      status: 401,
    });
  }

  const account = await findSellerAccountById(accountId);
  if (!account) {
    throw new HttpError("Akun tidak ditemukan", {
      code: "NOT_FOUND",
      status: 404,
    });
  }

  if (resolveAccountRole(account.role) !== ACCOUNT_ROLE.ADMIN) {
    throw new HttpError("Akses hanya untuk admin", {
      code: "FORBIDDEN",
      status: 403,
    });
  }

  return account.id;
}
