import { Check, Lock } from "lucide-react";

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
  "Arah ke multi-link aktif dan limit lebih longgar",
  "Arah ke advanced customization",
];

export default function SellerUpgradePage() {
  return (
    <div className="space-y-6">
      <FadeIn className="ui-hero-panel px-6 py-7 sm:px-8 sm:py-8">
        <div className="space-y-4">
          <p className="ui-kicker tracking-[0.22em]">Upgrade Pro</p>
          <h1 className="ui-title max-w-[18ch] text-4xl font-semibold sm:text-5xl">
            Pilih plan yang pas untuk fase bisnis seller kamu.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
            Free dipertahankan untuk validasi flow. Pro disiapkan untuk seller yang butuh
            kapasitas dan kontrol lebih besar.
          </p>
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

        <Card className="space-y-4 rounded-[1.8rem]">
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
          <Button href="#upgrade-cta" size="default" className="w-full sm:w-auto">
            Upgrade ke Pro
          </Button>
        </Card>
      </section>

      <Card id="upgrade-cta" className="space-y-3 rounded-[1.8rem]">
        <p className="text-sm font-semibold text-[var(--foreground)]">Langkah Upgrade</p>
        <p className="text-sm leading-6 text-[var(--foreground-muted)]">
          Checkout online belum tersedia. Upgrade Pro saat ini melalui proses aktivasi manual dari tim.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/seller/setup" size="default" className="w-full sm:w-auto">
            Lanjutkan dari Setup Seller
          </Button>
          <Button href="/seller" size="default" variant="secondary" className="w-full sm:w-auto">
            Kembali ke Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
