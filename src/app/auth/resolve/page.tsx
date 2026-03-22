import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { resolveAccountRole } from "@/server/auth/roles";
import {
  AUTH_ADMIN_SESSION_COOKIE_NAME,
  AUTH_SELLER_SESSION_COOKIE_NAME,
  getSessionSellerIdFromRawToken,
} from "@/server/auth/session";
import { findSellerAccountById } from "@/server/repositories/seller-account.repo";

type ResolvePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResolveAuthPage({ searchParams }: ResolvePageProps) {
  const cookieStore = await cookies();
  const sellerToken = cookieStore.get(AUTH_SELLER_SESSION_COOKIE_NAME)?.value;
  const adminToken = cookieStore.get(AUTH_ADMIN_SESSION_COOKIE_NAME)?.value;
  const sellerId = await getSessionSellerIdFromRawToken(sellerToken);
  const adminId = await getSessionSellerIdFromRawToken(adminToken);

  const resolvedSearchParams = await searchParams;
  const rawNextPath = resolvedSearchParams.next;
  const nextPath = Array.isArray(rawNextPath) ? rawNextPath[0] : rawNextPath;
  const safeNextPath = nextPath?.startsWith("/") ? nextPath : null;

  if (safeNextPath?.startsWith("/admin")) {
    if (adminId) {
      redirect(safeNextPath);
    }
    redirect("/auth/admin/login");
  }

  if (safeNextPath?.startsWith("/seller")) {
    if (sellerId) {
      redirect(safeNextPath);
    }
    redirect("/auth/seller/login");
  }

  if (safeNextPath) {
    redirect(safeNextPath);
  }

  if (adminId) {
    const adminAccount = await findSellerAccountById(adminId);
    const adminRole = resolveAccountRole(adminAccount?.role);
    if (adminRole === "ADMIN") {
      redirect("/admin");
    }
  }

  if (sellerId) {
    redirect("/seller/setup");
  }

  redirect("/auth/seller/login");
}
