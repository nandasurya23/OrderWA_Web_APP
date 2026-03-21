import Link from "next/link";
import { MessageSquareText } from "lucide-react";

import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-soft)] bg-[rgba(243,245,249,0.72)] backdrop-blur-xl">
      <SectionContainer className="py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.84)] shadow-[0_10px_24px_rgba(16,35,60,0.08)]">
              <MessageSquareText
                aria-hidden="true"
                className="h-5 w-5 text-[var(--accent)]"
              />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
                OrderWA
              </p>
              <p className="hidden text-sm leading-6 text-[var(--foreground)] sm:block">
                Workspace order WhatsApp untuk seller modern.
              </p>
            </div>
          </Link>

          <Button href="/auth/register" size="default">
            Mulai Gratis
          </Button>
        </div>
      </SectionContainer>
    </header>
  );
}
