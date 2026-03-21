"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutTemplate, Store } from "lucide-react";

import { cn } from "@/lib/utils";

const sellerLinks = [
  {
    href: "/seller/setup",
    label: "Setup Form",
    description: "Atur format dan link customer",
    icon: LayoutTemplate,
  },
  {
    href: "/seller/profile",
    label: "Profil Seller",
    description: "Simpan identitas dan nomor tujuan",
    icon: Store,
  },
];

export function SellerNav() {
  const pathname = usePathname();

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {sellerLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "group rounded-[1.4rem] border px-4 py-4 transition-[border-color,background-color,transform,box-shadow] duration-200",
              isActive
                ? "border-[var(--accent)] bg-[linear-gradient(180deg,rgba(19,60,112,0.08)_0%,rgba(19,60,112,0.02)_100%)] shadow-[0_20px_45px_rgba(19,60,112,0.12)]"
                : "border-[var(--border)] bg-[rgba(255,255,255,0.74)] hover:border-[var(--border-strong)] hover:bg-[rgba(255,255,255,0.94)]",
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors duration-200",
                  isActive
                    ? "border-[rgba(19,60,112,0.12)] bg-[rgba(19,60,112,0.12)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground-muted)] group-hover:text-[var(--accent)]",
                )}
              >
                <Icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {link.label}
                </p>
                <p className="text-sm leading-6 text-[var(--foreground-muted)]">
                  {link.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
