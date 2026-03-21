import { FadeIn } from "@/components/motion/fade-in";
import { SectionContainer } from "@/components/shared/section-container";
import { SellerProfileForm } from "@/features/seller-profile/components/seller-profile-form";

export default function SellerProfilePage() {
  return (
    <div className="py-12 sm:py-16">
      <SectionContainer className="space-y-10">
        <FadeIn className="grid gap-5 rounded-[2rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.74)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-end">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
              Profil Seller
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-[1.04] tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl">
                Simpan identitas toko dan nomor WhatsApp tujuan dengan jelas.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
                Data ini menjadi fondasi flow seller. Nomor tujuan di sini akan
                dipakai langsung pada link form customer.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                Checklist
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                Nama toko, nomor tujuan, dan deskripsi singkat.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                Dampak langsung
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                Store slug akan dipakai otomatis di link publik customer.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <SellerProfileForm />
        </FadeIn>
      </SectionContainer>
    </div>
  );
}
