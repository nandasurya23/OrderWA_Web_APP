import { Check, CreditCard, Gem, Lock, Sparkles } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const freeFeatures = [
  "1 link aktif per 24 jam",
  "Watermark OrderWA pada pesan",
  "Setup form dasar + custom field minimum",
];

const proFeatures = [
  "Tanpa watermark",
  "Multi-link aktif dan limit generate lebih longgar",
  "Advanced customization untuk workflow seller",
  "Fondasi seller assistant yang lebih kuat",
];

export default function SellerUpgradePage() {
  return (
    <div className="space-y-6">
      <FadeIn className="ui-hero-panel px-6 py-7 sm:px-8 sm:py-8">
        <div className="space-y-5">
          <p className="ui-kicker tracking-[0.22em]">Upgrade Pro</p>
          <h1 className="ui-title max-w-[16ch] text-4xl font-semibold sm:text-5xl">
            Naik kelas ke Pro untuk workflow seller yang lebih siap scale.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
            Pro memberi kapasitas lebih longgar, kontrol lebih kuat, dan fondasi otomatisasi lanjutan.
            Free tetap tersedia sebagai jalur validasi yang ringan.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--foreground-muted)]">
              <Gem aria-hidden="true" className="h-3.5 w-3.5 text-[var(--accent)]" />
              Status sekarang: aktivasi Pro manual
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--foreground-muted)]">
              <CreditCard aria-hidden="true" className="h-3.5 w-3.5 text-[var(--accent)]" />
              Billing online: belum terintegrasi penuh
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/seller/upgrade/checkout" size="default" className="w-full sm:w-auto">
              Ajukan Aktivasi Pro
            </Button>
            <Button href="/seller/setup" size="default" variant="secondary" className="w-full sm:w-auto">
              Lanjutkan Free Dulu
            </Button>
          </div>
        </div>
      </FadeIn>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="space-y-4 rounded-[1.8rem]">
          <p className="ui-kicker tracking-[0.16em]">Free</p>
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">Mulai Gratis</h2>
          <div className="space-y-2">
            {freeFeatures.map((item) => (
              <p key={item} className="flex items-start gap-2 text-sm text-[var(--foreground-muted)]">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                <span>{item}</span>
              </p>
            ))}
          </div>
          <Button href="/seller/setup" size="default" variant="secondary" className="w-full sm:w-auto">
            Tetap Pakai Free
          </Button>
        </Card>

        <Card className="space-y-4 rounded-[1.8rem] border-[var(--accent)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(242,247,255,0.92)_100%)]">
          <p className="ui-kicker tracking-[0.16em]">Pro</p>
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">Scale dengan Pro</h2>
          <div className="space-y-2">
            {proFeatures.map((item) => (
              <p key={item} className="flex items-start gap-2 text-sm text-[var(--foreground-muted)]">
                <Lock aria-hidden="true" className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                <span>{item}</span>
              </p>
            ))}
          </div>
          <Button href="/seller/upgrade/checkout" size="default" className="w-full sm:w-auto">
            Lanjut ke Checkout Pro
          </Button>
        </Card>
      </section>

      <Card className="space-y-4 rounded-[1.8rem]">
        <p className="ui-kicker tracking-[0.16em]">Nilai Untuk Seller</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Lebih Cepat</p>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">Operasional harian lebih ringan saat flow order sudah stabil.</p>
          </div>
          <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Lebih Rapi</p>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">Kontrol output pesan dan setup jadi lebih konsisten lintas customer.</p>
          </div>
          <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Lebih Siap Scale</p>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">Fondasi fitur lanjutan siap dipakai saat kebutuhan bisnis bertambah.</p>
          </div>
        </div>
      </Card>

      <Card id="upgrade-cta" className="space-y-4 rounded-[1.8rem]">
        <p className="text-sm font-semibold text-[var(--foreground)]">Cara Upgrade & Pembayaran</p>
        <p className="text-sm leading-6 text-[var(--foreground-muted)]">
          Pembayaran/checkout otomatis belum tersedia di aplikasi. Upgrade saat ini diproses
          manual setelah permintaan aktivasi dari seller.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
              Cara Upgrade
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              Ajukan aktivasi Pro dulu, lalu tim akan lanjutkan proses manual.
            </p>
          </div>
          <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
              Pembayaran
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              Gateway otomatis belum aktif. Instruksi pembayaran diberikan manual saat pengajuan diproses.
            </p>
          </div>
        </div>
        <div className="grid gap-3 rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--foreground-muted)]">
          <p className="flex items-start gap-2">
            <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
            Lengkapi profil dan setup seller agar kebutuhan upgrade jelas.
          </p>
          <p className="flex items-start gap-2">
            <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
            Kirim permintaan aktivasi Pro dari workspace seller (manual).
          </p>
          <p className="flex items-start gap-2">
            <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
            Setelah diproses, tim memberikan instruksi pembayaran dan konfirmasi aktivasi.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href="/seller/upgrade/checkout" size="default" className="w-full sm:w-auto">
            Buka Halaman Checkout Pro
          </Button>
          <Button href="/seller/setup" size="default" variant="secondary" className="w-full sm:w-auto">
            Review Setup Dulu
          </Button>
          <Button href="/seller" size="default" variant="ghost" className="w-full sm:w-auto">
            Kembali ke Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
