import Link from "next/link";
import { MessageSquareText } from "lucide-react";

import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";

const marketingLinks = [
  {
    href: "/#how-it-works",
    label: "Cara Kerja",
  },
  {
    href: "/#features",
    label: "Fitur",
  },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-soft)] bg-[rgba(243,245,249,0.72)] backdrop-blur-xl">
      <SectionContainer className="py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.84)] shadow-[0_10px_24px_rgba(16,35,60,0.08)]">
              <MessageSquareText
                aria-hidden="true"
                className="h-5 w-5 text-[var(--accent)]"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
                OrderWA
              </p>
              <p className="text-sm leading-6 text-[var(--foreground)]">
                Workspace order WhatsApp yang rapi dan siap dibagikan.
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <nav className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.64)] p-1.5 shadow-[0_10px_30px_rgba(16,35,60,0.06)]">
              {marketingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-[var(--foreground-muted)] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.9)] hover:text-[var(--foreground)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Button href="/auth/register">
              Mulai Gratis
            </Button>
          </div>
        </div>
      </SectionContainer>
    </header>
  );
}
