import { FadeIn } from "@/components/motion/fade-in";
import { SellerProfileForm } from "@/features/seller-profile/components/seller-profile-form";

export default function SellerProfilePage() {
  return (
    <div className="space-y-6">
      <FadeIn className="ui-hero-panel px-6 py-7 sm:px-8 sm:py-8">
        <div className="space-y-4">
          <p className="ui-kicker tracking-[0.22em]">
            Profil Seller
          </p>
          <h1 className="ui-title max-w-[18ch] text-4xl font-semibold sm:text-5xl">
            Lengkapi fondasi identitas toko untuk flow order yang akurat.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
            Data profil dipakai langsung untuk tujuan WhatsApp, slug publik, dan kejelasan informasi toko di seluruh alur seller.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <SellerProfileForm />
      </FadeIn>
    </div>
  );
}
