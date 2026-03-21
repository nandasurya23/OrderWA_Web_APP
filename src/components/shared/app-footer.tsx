import Link from "next/link";

import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";

export function AppFooter() {
  return (
    <footer className="border-t border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)]">
      <SectionContainer className="py-8 sm:py-10">
        <div className="overflow-hidden rounded-[2.2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(244,247,251,0.9)_100%)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
                OrderWA
              </p>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.05em] text-[var(--foreground)] sm:text-4xl">
                Flow order WhatsApp yang rapi dari setup sampai konfirmasi.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[var(--foreground-muted)]">
                Seller atur sekali, customer isi form, lalu pesan masuk ke WhatsApp
                dengan format yang lebih mudah diproses.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button href="/auth/register" size="large" className="w-full">
                Mulai Gratis
              </Button>
              <Button href="/seller/setup" size="large" variant="secondary" className="w-full">
                Langsung ke Setup
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 border-t border-[var(--border-soft)] pt-6 sm:grid-cols-3">
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">Setup seller</p>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                Atur field dan teks order dari satu dashboard.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">Link customer</p>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                Link konfirmasi siap dibagikan tanpa langkah tambahan.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">WhatsApp-ready</p>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                Pesan lebih rapi sebelum dikirim ke seller.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[var(--foreground-muted)]">
            Seller workspace, public form, dan konfirmasi pesanan dalam satu flow.
          </p>
        </div>
      </SectionContainer>
    </footer>
  );
}
