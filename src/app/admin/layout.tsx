import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { resolveAccountRole } from "@/server/auth/roles";
import {
  AUTH_ADMIN_SESSION_COOKIE_NAME,
  getSessionSellerIdFromRawToken,
} from "@/server/auth/session";
import { findSellerAccountById } from "@/server/repositories/seller-account.repo";

type AdminLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(AUTH_ADMIN_SESSION_COOKIE_NAME)?.value;
  const accountId = await getSessionSellerIdFromRawToken(rawToken);

  if (!accountId) {
    redirect("/auth/admin/login?next=%2Fadmin");
  }

  const account = await findSellerAccountById(accountId);
  const role = resolveAccountRole(account?.role);

  if (role !== "ADMIN") {
    redirect("/auth/seller/login?next=%2Fseller");
  }

  return <>{children}</>;
}
