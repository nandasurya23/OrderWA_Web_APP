import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionContainer } from "@/components/shared/section-container";
import { CustomerOrderShell } from "@/features/customer-order-form/components/customer-order-shell";
import { HttpError } from "@/server/http/errors";
import { resolvePublicOrderConfigByStoreSlug } from "@/server/services/public-order-link.service";

type ConfirmationPageProps = {
  params: Promise<{
    storeSlug: string;
  }>;
};

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const resolvedParams = await params;
  let invalidLinkReason: string | null = null;

  const config = await resolvePublicOrderConfigByStoreSlug(resolvedParams.storeSlug)
    .then((payload) => ({
      ...payload.config,
      destinationPhoneNumber: payload.seller.destinationPhoneNumber,
    }))
    .catch((error: unknown) => {
      if (error instanceof HttpError) {
        if (error.code === "LINK_INACTIVE") {
          invalidLinkReason = "Link ini sudah dinonaktifkan oleh seller.";
          return null;
        }

        if (error.code === "LINK_EXPIRED") {
          invalidLinkReason = "Link ini sudah kedaluwarsa.";
          return null;
        }

        if (error.code === "LINK_NOT_FOUND") {
          invalidLinkReason = "Link tidak ditemukan.";
          return null;
        }
      }

      invalidLinkReason = "Link tidak valid atau belum tersedia.";
      return null;
    });

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-12 sm:py-16">
        <SectionContainer className="space-y-10">
          <FadeIn className="grid gap-5 rounded-[2rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.72)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-end">
            <div className="space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
                Konfirmasi Pesanan
              </p>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold leading-[1.04] tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl">
                  Isi order, cek hasil pesan, lalu kirim ke WhatsApp seller.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
                  Form ini sudah mengikuti pengaturan seller, jadi kamu tinggal isi data
                  yang dibutuhkan dan buat pesannya.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <CustomerOrderShell config={config} invalidLinkReason={invalidLinkReason} />
          </FadeIn>
        </SectionContainer>
      </main>
      <AppFooter />
    </div>
  );
}
