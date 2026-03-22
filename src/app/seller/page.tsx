import { FadeIn } from "@/components/motion/fade-in";
import { SellerDashboardShell } from "@/features/seller-dashboard/components/seller-dashboard-shell";

export default function SellerDashboardPage() {
  return (
    <div className="space-y-6">
      <FadeIn className="ui-hero-panel px-6 py-7 sm:px-8 sm:py-8">
        <div className="space-y-4">
          <p className="ui-kicker tracking-[0.22em]">
            Dashboard Seller
          </p>
          <h1 className="ui-title max-w-[18ch] text-4xl font-semibold sm:text-5xl">
            Kontrol kerja harian seller dalam satu tampilan.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
            Pantau plan aktif, status link, cooldown, dan aktivitas terbaru untuk memastikan order flow tetap lancar.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <SellerDashboardShell />
      </FadeIn>
    </div>
  );
}
