import { FadeIn } from "@/components/motion/fade-in";
import { SectionContainer } from "@/components/shared/section-container";
import { SellerProfileForm } from "@/features/seller-profile/components/seller-profile-form";

export default function SellerProfilePage() {
  return (
    <div className="py-12 sm:py-16">
      <SectionContainer className="space-y-10">
        <FadeIn className="grid gap-5 rounded-[2rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.7)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-end">
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

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
              Dampak langsung
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
              Saat profil lengkap, halaman setup bisa langsung menghasilkan link
              customer yang valid tanpa setup tambahan.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <SellerProfileForm />
        </FadeIn>
      </SectionContainer>
    </div>
  );
}
