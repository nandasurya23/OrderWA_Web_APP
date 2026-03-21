import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardList,
  LayoutTemplate,
  Link2,
  MessageSquareText,
  Send,
  Sparkles,
  Store,
} from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer } from "@/components/motion/stagger-container";
import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";

const trustPoints = [
  "Setup cepat",
  "Form ringan",
  "Siap ke WhatsApp",
];

const featureHighlights = [
  {
    icon: LayoutTemplate,
    title: "Setup seller terasa seperti dashboard produk",
    description:
      "Atur pembuka, penutup, dan field order dari satu alur yang fokus.",
  },
  {
    icon: Link2,
    title: "Link customer langsung membawa form yang benar",
    description:
      "Satu link cukup untuk membawa customer ke form order yang tepat.",
  },
  {
    icon: MessageSquareText,
    title: "Preview hasil order lebih mudah dipercaya",
    description:
      "Customer bisa cek hasil pesan sebelum lanjut ke WhatsApp seller.",
  },
  {
    icon: Send,
    title: "CTA diarahkan ke tindakan utama",
    description:
      "Mulai setup, bagikan link, lalu kirim pesan tanpa langkah yang membingungkan.",
  },
];

const steps = [
  {
    title: "Seller menyusun form order",
    description:
      "Atur pembuka, penutup, dan field yang perlu diisi customer.",
    badge: "Step 1",
  },
  {
    title: "Link customer langsung siap dibagikan",
    description:
      "Setelah setup selesai, link customer langsung siap dipakai.",
    badge: "Step 2",
  },
  {
    title: "Customer mengirim pesan yang lebih rapi",
    description:
      "Input form berubah jadi pesan WhatsApp yang lebih rapi dan mudah diproses.",
    badge: "Step 3",
  },
];

const sellerChecklist = [
  "Atur pembuka dan penutup",
  "Pilih field yang ingin tampil",
  "Salin link customer",
];

const customerFields = ["Nama", "Produk", "Jumlah", "Alamat", "Catatan"];

const messageRows = [
  "Nama: Surya",
  "Produk: Kaos Hitam",
  "Jumlah: 2 pcs",
  "Alamat: Denpasar",
  "Catatan: Kirim sore",
];

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-6 sm:py-10">
        <SectionContainer>
          <StaggerContainer className="space-y-20 sm:space-y-24">
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-stretch">
              <FadeIn className="relative overflow-hidden rounded-[2.8rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(246,249,255,0.84)_100%)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
                <div className="absolute left-[-3rem] top-[-3rem] h-36 w-36 rounded-full bg-[rgba(19,60,112,0.08)] blur-3xl" />
                <div className="absolute bottom-[-4rem] right-[-2rem] h-48 w-48 rounded-full bg-[rgba(32,91,158,0.08)] blur-3xl" />

                <div className="relative flex h-full flex-col justify-between gap-10">
                  <div className="space-y-7">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.82)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                      <Sparkles aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                      Flow order WhatsApp yang lebih rapi
                    </div>

                    <div className="space-y-5">
                      <h1 className="max-w-2xl text-5xl font-semibold leading-[0.96] tracking-[-0.08em] text-[var(--foreground)] sm:text-6xl lg:text-[4.7rem]">
                        Order WhatsApp yang lebih rapi dari awal.
                      </h1>
                      <p className="max-w-lg text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
                        Seller setup sekali, customer isi form, lalu pesan siap
                        dikirim ke WhatsApp dengan format yang lebih jelas.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button href="/auth/register" size="large">
                        Mulai Gratis
                        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                      </Button>
                      <Button href="/seller/setup" size="large" variant="secondary">
                        Lihat Setup
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {trustPoints.map((point) => (
                        <div
                          key={point}
                          className="rounded-[1.25rem] border border-[var(--border)] bg-[rgba(255,255,255,0.78)] px-4 py-4"
                        >
                          <div className="flex items-start gap-2">
                            <BadgeCheck
                              aria-hidden="true"
                              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]"
                            />
                            <p className="text-sm leading-6 text-[var(--foreground-muted)]">
                              {point}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.35rem] border border-[var(--border)] bg-[rgba(255,255,255,0.78)] px-4 py-4">
                      <p className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                        1x setup
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                        Seller cukup atur sekali.
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] border border-[var(--border)] bg-[rgba(255,255,255,0.78)] px-4 py-4">
                      <p className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                        1 link
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                        Customer langsung masuk ke form yang tepat.
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] border border-[var(--border)] bg-[rgba(255,255,255,0.78)] px-4 py-4">
                      <p className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                        Ready to send
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
                        Pesan siap dibawa ke WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn className="rounded-[2.8rem] border border-[rgba(16,35,60,0.08)] bg-[linear-gradient(180deg,#133c70_0%,#0d294b_100%)] p-4 shadow-[0_36px_100px_rgba(19,60,112,0.26)] sm:p-5">
                <div className="flex h-full flex-col gap-4">
                  <div className="rounded-[1.6rem] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] px-4 py-4 text-[rgba(246,249,255,0.84)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgba(246,249,255,0.64)]">
                      Product Preview
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      Seller setup dan customer form
                    </h2>
                  </div>

                  <div className="grid flex-1 gap-4 lg:grid-rows-[auto_1fr]">
                    <div className="rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] p-5 text-[rgba(246,249,255,0.88)]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)]">
                          <LayoutTemplate aria-hidden="true" className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(246,249,255,0.64)]">
                              Seller Flow
                          </p>
                          <p className="mt-1 text-lg font-semibold">
                            Atur order sekali
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-3">
                        {sellerChecklist.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-3 rounded-[1.15rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] px-4 py-3"
                          >
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.14)]">
                              <Check aria-hidden="true" className="h-3.5 w-3.5" />
                            </div>
                            <p className="text-sm leading-6 text-[rgba(246,249,255,0.82)]">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
                      <div className="rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] p-5 text-[rgba(246,249,255,0.88)]">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)]">
                            <ClipboardList aria-hidden="true" className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(246,249,255,0.64)]">
                              Customer Form
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                              Form ringan
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 space-y-2">
                          {customerFields.map((field) => (
                            <div
                              key={field}
                              className="rounded-[1.05rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] px-4 py-3 text-sm text-[rgba(246,249,255,0.78)]"
                            >
                              {field}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.8rem] border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,247,251,0.96)_100%)] p-5 text-[var(--foreground)]">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                              WhatsApp Result
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                              Pesan siap kirim
                            </p>
                          </div>
                          <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
                            Ready
                          </div>
                        </div>

                        <div className="mt-5 rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                          <p className="text-sm leading-7 text-[var(--foreground)]">
                            Halo kak, saya mau order:
                          </p>
                          <div className="mt-3 space-y-1.5 text-sm leading-7 text-[var(--foreground)]">
                            {messageRows.map((row) => (
                              <p key={row}>{row}</p>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-center text-sm font-medium text-[var(--foreground-muted)]">
                            Salin pesan
                          </div>
                          <div className="rounded-[1rem] bg-[linear-gradient(135deg,#163e73_0%,#0f2f57_100%)] px-3 py-3 text-center text-sm font-semibold text-[var(--accent-foreground)]">
                            Kirim ke WhatsApp
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
              <FadeIn className="rounded-[2.3rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.78)] p-7 shadow-[var(--shadow-soft)] sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
                  Value Proposition
                </p>
                <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.05em] text-[var(--foreground)] sm:text-4xl">
                  Bukan sekadar generator pesan.
                </h2>
                <p className="mt-4 max-w-lg text-base leading-8 text-[var(--foreground-muted)]">
                  OrderWA membantu seller terlihat lebih siap, customer lebih
                  mudah order, dan pesan lebih rapi saat dikirim.
                </p>
              </FadeIn>

              <StaggerContainer className="grid gap-4 sm:grid-cols-2">
                {featureHighlights.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <FadeIn
                      key={feature.title}
                      className="rounded-[1.9rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.78)] p-6 shadow-[var(--shadow-soft)]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
                        <Icon aria-hidden="true" className="h-5 w-5 text-[var(--accent)]" />
                      </div>
                  <h3 className="mt-5 text-xl font-semibold leading-tight text-[var(--foreground)]">
                        {feature.title}
                  </h3>
                      <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--foreground-muted)]">
                        {feature.description}
                      </p>
                    </FadeIn>
                  );
                })}
              </StaggerContainer>
            </section>

            <section
              id="how-it-works"
              className="rounded-[2.6rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(244,247,251,0.88)_100%)] px-6 py-7 shadow-[var(--shadow-soft)] scroll-mt-28 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start">
                <FadeIn className="space-y-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
                    How It Works
                  </p>
                  <h2 className="max-w-lg text-3xl font-semibold leading-tight tracking-[-0.05em] text-[var(--foreground)] sm:text-4xl lg:text-5xl">
                    Tiga langkah yang langsung terasa.
                  </h2>
                  <p className="max-w-lg text-base leading-8 text-[var(--foreground-muted)]">
                    Seller setup, bagikan link, lalu customer kirim pesan yang
                    sudah rapi.
                  </p>
                </FadeIn>

                <StaggerContainer className="grid gap-4">
                  {steps.map((step) => (
                    <FadeIn
                      key={step.badge}
                      className="grid gap-4 rounded-[1.9rem] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] p-5 shadow-[var(--shadow-soft)] sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start"
                    >
                      <div className="inline-flex h-12 min-w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#163e73_0%,#0f2f57_100%)] px-4 text-sm font-semibold text-[var(--accent-foreground)]">
                        {step.badge}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold leading-tight text-[var(--foreground)]">
                          {step.title}
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--foreground-muted)]">
                          {step.description}
                        </p>
                      </div>
                    </FadeIn>
                  ))}
                </StaggerContainer>
              </div>
            </section>

            <section
              id="features"
              className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch scroll-mt-28"
            >
              <FadeIn className="rounded-[2.5rem] border border-[rgba(16,35,60,0.08)] bg-[linear-gradient(180deg,#133c70_0%,#0d294b_100%)] p-7 text-[var(--accent-foreground)] shadow-[0_30px_90px_rgba(19,60,112,0.24)] sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgba(246,249,255,0.64)]">
                  Why This Homepage Works
                </p>
                <h2 className="mt-3 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">
                  CTA dan preview sekarang langsung terlihat.
                </h2>
                <p className="mt-4 max-w-lg text-base leading-8 text-[rgba(246,249,255,0.76)]">
                  User langsung melihat hasil, memahami flow, lalu tahu harus klik ke mana.
                </p>
              </FadeIn>

              <FadeIn className="rounded-[2.5rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.82)] p-7 shadow-[var(--shadow-soft)] sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
                  Closing CTA
                </p>
                <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.05em] text-[var(--foreground)] sm:text-4xl">
                  Mulai setup dan bagikan form order.
                </h2>
                <p className="mt-4 max-w-md text-base leading-8 text-[var(--foreground-muted)]">
                  Jika setup seller sudah siap, langkah berikutnya tinggal bagikan link ke customer.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Button href="/auth/register" size="large">
                    Mulai Gratis
                  </Button>
                  <Button href="/seller/setup" size="large" variant="secondary">
                    Lihat Setup
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
