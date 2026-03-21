import { ArrowRight, Check, ClipboardList, Link2, MessageSquareText, Store } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer } from "@/components/motion/stagger-container";
import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";

const quickWins = [
  "Setup seller sekali, pakai berulang",
  "Link customer langsung ke form aktif",
  "Pesan WhatsApp lebih siap diproses",
];

const howItWorks = [
  {
    step: "01",
    title: "Seller setup flow order",
    description: "Atur teks pembuka, penutup, dan field yang ingin ditampilkan.",
    icon: Store,
  },
  {
    step: "02",
    title: "Bagikan link konfirmasi",
    description: "Link publik siap dibagikan ke customer tanpa setup tambahan.",
    icon: Link2,
  },
  {
    step: "03",
    title: "Customer kirim order rapi",
    description: "Customer isi form, preview pesan, lalu kirim ke WhatsApp seller.",
    icon: MessageSquareText,
  },
];

const featureCards = [
  {
    title: "Seller workspace yang fokus",
    description: "Pengaturan profile, config, dan share link ada di alur yang sama.",
  },
  {
    title: "Public form yang aman",
    description: "Link publik punya validasi aktif/expired sehingga flow lebih terjaga.",
  },
  {
    title: "CTA langsung ke tindakan utama",
    description: "User langsung tahu langkah lanjut: setup, bagikan, lalu proses order.",
  },
];

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-8 sm:py-12">
        <SectionContainer>
          <StaggerContainer className="space-y-14 sm:space-y-20">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch">
              <FadeIn className="rounded-[2.5rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(243,248,255,0.84)_100%)] px-6 py-7 shadow-[var(--shadow-strong)] sm:px-8 sm:py-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                  OrderWA for Seller
                </p>
                <h1 className="mt-4 max-w-[15ch] text-5xl font-semibold leading-[0.95] tracking-[-0.07em] text-[var(--foreground)] sm:text-6xl">
                  Konfirmasi pesanan yang lebih profesional.
                </h1>
                <p className="mt-5 max-w-[var(--max-text-measure)] text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
                  Ganti flow chat acak dengan alur order yang lebih jelas: seller setup,
                  customer isi form, lalu pesan siap kirim ke WhatsApp.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button href="/auth/register" size="large">
                    Mulai Gratis
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Button>
                  <Button href="/seller/setup" size="large" variant="secondary">
                    Lihat Seller Setup
                  </Button>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {quickWins.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] px-4 py-4"
                    >
                      <p className="text-sm leading-6 text-[var(--foreground-muted)]">{item}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn className="rounded-[2.5rem] border border-[rgba(16,35,60,0.08)] bg-[linear-gradient(180deg,#123d74_0%,#0d2d54_100%)] p-5 text-[var(--accent-foreground)] shadow-[0_26px_74px_rgba(15,58,114,0.3)] sm:p-6">
                <div className="grid gap-4">
                  <div className="rounded-[1.35rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(246,249,255,0.68)]">
                      Product Preview
                    </p>
                    <p className="mt-2 text-lg font-semibold">Seller to Customer Flow</p>
                  </div>

                  <div className="rounded-[1.35rem] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] p-4">
                    <p className="text-sm font-semibold">Seller Setup</p>
                    <div className="mt-3 space-y-2 text-sm text-[rgba(246,249,255,0.82)]">
                      <p className="rounded-lg border border-[rgba(255,255,255,0.14)] px-3 py-2">Atur field order</p>
                      <p className="rounded-lg border border-[rgba(255,255,255,0.14)] px-3 py-2">Generate link customer</p>
                    </div>
                  </div>

                  <div className="rounded-[1.35rem] border border-[var(--border)] bg-[rgba(255,255,255,0.94)] p-4 text-[var(--foreground)]">
                    <p className="text-sm font-semibold">Customer Result</p>
                    <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm leading-6">
                      <p>Halo kak, saya mau order:</p>
                      <p>Nama: Surya</p>
                      <p>Produk: Kaos Hitam</p>
                      <p>Jumlah: 2 pcs</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </section>

            <section className="grid gap-5 lg:grid-cols-3">
              {howItWorks.map((item) => {
                const Icon = item.icon;
                return (
                  <FadeIn
                    key={item.step}
                    className="rounded-[1.9rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.82)] p-6 shadow-[var(--shadow-soft)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                        Step {item.step}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]">
                        <Icon aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                      </div>
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)]">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                      {item.description}
                    </p>
                  </FadeIn>
                );
              })}
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
              <div className="space-y-4 rounded-[2.2rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.82)] p-7 shadow-[var(--shadow-soft)] sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                  Feature Highlights
                </p>
                <h2 className="max-w-[18ch] text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-[var(--foreground)]">
                  Fondasi order flow yang siap dipakai harian.
                </h2>
                <div className="space-y-3 pt-2">
                  {featureCards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-[1.15rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
                    >
                      <p className="text-sm font-semibold text-[var(--foreground)]">{card.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <FadeIn className="rounded-[2.2rem] border border-[rgba(16,35,60,0.08)] bg-[linear-gradient(180deg,#123d74_0%,#0e315a_100%)] p-7 text-[var(--accent-foreground)] shadow-[0_24px_64px_rgba(15,58,114,0.28)] sm:p-8 lg:sticky lg:top-24">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgba(246,249,255,0.68)]">
                  Closing CTA
                </p>
                <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em]">
                  Mulai dari setup, bukan dari chat manual.
                </h3>
                <p className="mt-4 text-sm leading-7 text-[rgba(246,249,255,0.8)]">
                  Pakai workspace seller untuk menyiapkan flow order yang konsisten dan
                  lebih mudah diproses.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <Button href="/auth/register" size="large">
                    Mulai Gratis
                  </Button>
                  <Button href="/seller/setup" size="large" variant="secondary">
                    Coba Setup
                  </Button>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4" />
                    <span>Setup cepat tanpa ubah flow utama bisnis.</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4" />
                    <span>Link publik terkontrol dan bisa dibagikan langsung.</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4" />
                    <span>Pesan order lebih jelas sebelum dikirim ke WhatsApp.</span>
                  </div>
                </div>
              </FadeIn>
            </section>
          </StaggerContainer>
        </SectionContainer>
      </main>
      <AppFooter />
    </div>
  );
}
