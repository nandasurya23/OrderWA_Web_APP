import { FadeIn } from "@/components/motion/fade-in";
import { SectionContainer } from "@/components/shared/section-container";
import { SellerOrderBuilderShell } from "@/features/seller-order-builder/components/seller-order-builder-shell";

export default function SellerSetupPage() {
  return (
    <div className="py-12 sm:py-16">
      <SectionContainer className="space-y-10">
        <FadeIn className="grid gap-5 rounded-[2rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.7)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
              Seller Setup
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-[1.04] tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl">
                Rancang form order yang siap dibagikan ke customer.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
                Atur teks, pilih field yang tampil, dan pantau preview pesan
                sebelum link customer kamu salin.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                Step 1
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                Nomor tujuan dari profil seller
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                Step 2
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                Susun field yang dibutuhkan customer
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                Step 3
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                Salin link dan mulai bagikan
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <SellerOrderBuilderShell />
        </FadeIn>
      </SectionContainer>
    </div>
  );
}
