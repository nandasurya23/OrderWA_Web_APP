import {
  ArrowRight,
  Bot,
  Check,
  CircleAlert,
  Layers,
  Lock,
  MessageSquareText,
  Sparkles,
  Timer,
} from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer } from "@/components/motion/stagger-container";
import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";

const painPoints = [
  "Chat order sering acak dan detail penting hilang.",
  "Seller harus menanyakan hal yang sama berulang kali.",
  "Lead masuk, tapi format pesan tidak siap diproses cepat.",
];

const featureHighlights = [
  {
    title: "Seller setup yang reusable",
    description:
      "Template starter, style pesan, urutan field, dan custom field disimpan untuk dipakai ulang.",
    icon: Layers,
  },
  {
    title: "Public form yang lebih rapi",
    description:
      "Customer isi form sesuai struktur seller, lalu pesan WhatsApp dibentuk otomatis sesuai urutan field.",
    icon: MessageSquareText,
  },
  {
    title: "Semi-AI direction yang praktis",
    description:
      "Saat ini rule-based helper sudah ada. Arah berikutnya: asistensi seller yang lebih pintar dan tetap terkontrol.",
    icon: Bot,
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Setup sekali di workspace seller",
    description: "Atur template, style pesan, dan struktur field order.",
  },
  {
    step: "02",
    title: "Bagikan link form ke customer",
    description: "Customer masuk ke form publik yang selalu mengikuti setup terbaru.",
  },
  {
    step: "03",
    title: "Terima pesan WhatsApp yang siap proses",
    description: "Output lebih konsisten sehingga follow-up dan operasional jadi lebih cepat.",
  },
];

const freePlanNotes = [
  "1 link publik per 24 jam",
  "Watermark OrderWA pada pesan",
  "Fondasi setup + custom field dasar",
];

const proDirectionNotes = [
  "Tanpa watermark",
  "Multi-link aktif dan limit lebih longgar",
  "Advanced customization dan seller assistant yang lebih kuat",
];

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-12 sm:py-16">
        <SectionContainer>
          <StaggerContainer className="space-y-20 sm:space-y-24">
            <section className="grid gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch">
              <FadeIn className="ui-hero-panel px-7 py-8 sm:px-10 sm:py-11">
                <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 ui-kicker tracking-[0.16em]">
                  <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                  OrderWA for Seller
                </p>
                <h1 className="ui-title mt-6 max-w-[15ch] text-5xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-6xl">
                  Ubah chat order jadi alur yang lebih jelas dan siap proses.
                </h1>
                <p className="mt-6 max-w-[58ch] text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
                  OrderWA membantu seller merapikan order flow dari setup hingga pesan WhatsApp final.
                  Fokusnya bukan sekadar form, tapi sistem kerja order yang konsisten untuk tim seller.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button href="/auth/register" size="large">
                    Mulai Gratis
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Button>
                  <Button href="/seller" size="large" variant="secondary">
                    Lihat Seller Dashboard
                  </Button>
                </div>

                <div className="mt-9 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
                    <p className="ui-kicker tracking-[0.16em]">
                      Fokus
                    </p>
                    <p className="mt-2 text-sm text-[var(--foreground-muted)]">Seller-first workflow</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
                    <p className="ui-kicker tracking-[0.16em]">
                      Plan
                    </p>
                    <p className="mt-2 text-sm text-[var(--foreground-muted)]">Free plan jelas, upgrade terarah</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
                    <p className="ui-kicker tracking-[0.16em]">
                      Direction
                    </p>
                    <p className="mt-2 text-sm text-[var(--foreground-muted)]">Smarter semi-AI seller assistant</p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn className="rounded-[2rem] border border-[rgba(16,35,60,0.1)] bg-[linear-gradient(180deg,#123d74_0%,#0e315a_100%)] p-6 text-[var(--accent-foreground)] shadow-[0_28px_74px_rgba(15,58,114,0.3)] sm:p-8">
                <div className="space-y-4">
                  <div className="rounded-[1.2rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(246,249,255,0.7)]">
                      New Seller Value
                    </p>
                    <p className="mt-2 text-lg font-semibold">Bukan cuma bikin link, tapi bikin sistem order.</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-4">
                    <p className="text-sm font-semibold">Yang didapat seller</p>
                    <div className="mt-3 space-y-2 text-sm text-[rgba(246,249,255,0.86)]">
                      <p className="rounded-lg border border-[rgba(255,255,255,0.16)] px-3 py-2">Setup reusable: starter + style + urutan field</p>
                      <p className="rounded-lg border border-[rgba(255,255,255,0.16)] px-3 py-2">Dashboard: status link, cooldown, dan riwayat</p>
                      <p className="rounded-lg border border-[rgba(255,255,255,0.16)] px-3 py-2">Output order lebih konsisten untuk operasional harian</p>
                    </div>
                  </div>
                  <div className="rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,255,255,0.92)] px-4 py-4 text-[var(--foreground)]">
                    <p className="text-sm font-semibold">Kenapa ini penting</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                      Seller tidak lagi mulai dari chat kosong di tiap customer. Struktur order jadi aset kerja yang bisa dipakai berulang.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-7">
              <FadeIn className="ui-surface-panel p-7 sm:p-8">
                <p className="ui-kicker tracking-[0.18em]">
                  Problem
                </p>
                <h2 className="mt-3 text-[2.25rem] font-semibold leading-[1.03] tracking-[-0.05em] text-[var(--foreground)]">
                  Pain points seller yang sering bikin proses lambat.
                </h2>
                <div className="mt-5 space-y-3">
                  {painPoints.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                    >
                      <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 text-[var(--danger)]" />
                      <p className="text-sm leading-6 text-[var(--foreground-muted)]">{point}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn className="ui-surface-panel p-7 sm:p-8">
                <p className="ui-kicker tracking-[0.18em]">
                  Why Seller
                </p>
                <h2 className="mt-3 text-[2.25rem] font-semibold leading-[1.03] tracking-[-0.05em] text-[var(--foreground)]">
                  Value yang langsung terasa di sisi seller.
                </h2>
                <div className="mt-5 space-y-3">
                  <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                    <p className="text-sm font-semibold text-[var(--foreground)]">Lebih cepat memproses order</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">Data masuk dalam format yang sudah siap dipakai.</p>
                  </div>
                  <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                    <p className="text-sm font-semibold text-[var(--foreground)]">Lebih konsisten lintas customer</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">Template dan style membantu jaga standar komunikasi.</p>
                  </div>
                  <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                    <p className="text-sm font-semibold text-[var(--foreground)]">Lebih siap scale</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">Flow order tidak bergantung pada improvisasi chat manual.</p>
                  </div>
                </div>
              </FadeIn>
            </section>

            <section className="space-y-7">
              <FadeIn>
                <p className="ui-kicker tracking-[0.18em]">
                  Feature Highlights
                </p>
                <h2 className="mt-3 max-w-[18ch] text-[2.35rem] font-semibold leading-[1.03] tracking-[-0.05em] text-[var(--foreground)]">
                  Fondasi produk baru yang lebih jelas untuk seller.
                </h2>
              </FadeIn>
              <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
                {featureHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <FadeIn
                      key={item.title}
                      className="ui-surface-panel p-6"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
                        <Icon aria-hidden="true" className="h-5 w-5 text-[var(--accent)]" />
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">{item.description}</p>
                    </FadeIn>
                  );
                })}
              </div>
            </section>

            <section className="space-y-7">
              <FadeIn>
                <p className="ui-kicker tracking-[0.18em]">
                  How It Works
                </p>
                <h2 className="mt-3 max-w-[18ch] text-[2.35rem] font-semibold leading-[1.03] tracking-[-0.05em] text-[var(--foreground)]">
                  Dari setup seller sampai pesan WhatsApp siap kirim.
                </h2>
              </FadeIn>
              <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
                {howItWorks.map((item) => (
                  <FadeIn
                    key={item.step}
                    className="ui-surface-panel p-6"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                      Step {item.step}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">{item.description}</p>
                  </FadeIn>
                ))}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2 lg:gap-7">
              <FadeIn className="ui-surface-panel p-7 sm:p-8">
                <p className="ui-kicker tracking-[0.18em]">
                  Free Plan
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)]">
                  Cukup untuk mulai, jelas batasnya.
                </h2>
                <div className="mt-5 space-y-2">
                  {freePlanNotes.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-[var(--foreground-muted)]">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-[var(--foreground-muted)]">
                  Batas free plan dibuat agar seller bisa mencoba alur end-to-end dengan ekspektasi yang transparan.
                </p>
              </FadeIn>

              <FadeIn className="rounded-[2rem] border border-[rgba(16,35,60,0.1)] bg-[linear-gradient(180deg,#123d74_0%,#0e315a_100%)] p-7 text-[var(--accent-foreground)] shadow-[0_24px_64px_rgba(15,58,114,0.28)] sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(246,249,255,0.7)]">
                  Pro Direction
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em]">
                  Upgrade untuk seller yang butuh skala dan otomatisasi lebih.
                </h2>
                <div className="mt-5 space-y-2">
                  {proDirectionNotes.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-[rgba(246,249,255,0.86)]">
                      <Lock aria-hidden="true" className="mt-0.5 h-4 w-4" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-[rgba(246,249,255,0.82)]">
                  Arahnya jelas: dari rule-based helper saat ini menuju seller assistant yang lebih pintar dan tetap terkontrol.
                </p>
              </FadeIn>
            </section>

            <section className="ui-hero-panel px-7 py-9 sm:px-11 sm:py-11">
              <FadeIn className="grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
                <div>
                  <p className="ui-kicker tracking-[0.18em]">
                    CTA
                  </p>
                  <h2 className="ui-title mt-3 max-w-[16ch] text-4xl font-semibold leading-[1.01] sm:text-5xl">
                    Bangun sistem order seller yang lebih rapi mulai hari ini.
                  </h2>
                  <p className="mt-4 max-w-[var(--max-text-measure)] text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
                    Mulai dari free plan, validasi flow, lalu lanjutkan ke level berikutnya saat bisnismu butuh lebih.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <Button href="/auth/register" size="large" className="w-full">
                    Mulai Gratis
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Button>
                  <Button href="/seller/setup" size="large" variant="secondary" className="w-full">
                    Lihat Setup Seller
                  </Button>
                  <Button href="/seller" size="large" variant="ghost" className="w-full">
                    <Timer aria-hidden="true" className="h-4 w-4" />
                    Lihat Dashboard & Cooldown
                  </Button>
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
