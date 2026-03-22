"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Gem, LayoutDashboard, LayoutTemplate, Store } from "lucide-react";

import { cn } from "@/lib/utils";

const sellerLinks = [
  {
    href: "/seller",
    label: "Dashboard",
    description: "Status plan, link, dan cooldown",
    icon: LayoutDashboard,
  },
  {
    href: "/seller/setup",
    label: "Setup Form",
    description: "Atur template dan link customer",
    icon: LayoutTemplate,
  },
  {
    href: "/seller/profile",
    label: "Profil Seller",
    description: "Identitas toko dan nomor tujuan",
    icon: Store,
  },
  {
    href: "/seller/upgrade",
    label: "Upgrade Pro",
    description: "Perbandingan plan dan langkah upgrade",
    icon: Gem,
  },
];

export function SellerNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2" aria-label="Seller workspace navigation">
      {sellerLinks.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/seller"
            ? pathname === "/seller"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "group flex items-center gap-3 rounded-[1.1rem] border px-3 py-3 transition-[border-color,background-color,transform,box-shadow] duration-200",
              isActive
                ? "border-[var(--accent)] bg-[linear-gradient(180deg,rgba(15,58,114,0.1)_0%,rgba(15,58,114,0.02)_100%)] shadow-[0_14px_28px_rgba(15,58,114,0.1)]"
                : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:bg-[rgba(255,255,255,0.95)]",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200",
                isActive
                  ? "border-[rgba(19,60,112,0.12)] bg-[rgba(19,60,112,0.12)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)] group-hover:text-[var(--accent)]",
              )}
            >
              <Icon aria-hidden="true" className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-sm font-semibold text-[var(--foreground)]">{link.label}</p>
              <p className="text-xs leading-5 text-[var(--foreground-muted)]">{link.description}</p>
            </div>
            <ChevronRight
              aria-hidden="true"
              className={cn(
                "h-4 w-4 text-[var(--foreground-muted)] transition-transform duration-200",
                isActive ? "translate-x-0.5 text-[var(--accent)]" : "group-hover:translate-x-0.5",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
