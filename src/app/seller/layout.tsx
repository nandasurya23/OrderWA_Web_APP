import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";
import { SellerNav } from "@/components/shared/seller-nav";
import { LogoutButton } from "@/features/auth/components/logout-button";

type SellerLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function SellerLayout({ children }: SellerLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-6 sm:py-8 lg:py-10">
        <SectionContainer>
          <div className="grid gap-5 lg:gap-6 xl:grid-cols-[minmax(0,290px)_minmax(0,1fr)] xl:items-start">
            <aside className="space-y-4 xl:sticky xl:top-24">
              <div className="ui-hero-panel p-5">
                <p className="ui-kicker">
                  Seller Workspace
                </p>
                <h2 className="ui-title mt-3 text-2xl font-semibold">
                  Pusat kerja order seller.
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground-muted)]">
                  Fokus pada produktivitas harian: setup, link, dan monitoring dalam satu workspace.
                </p>
                <div className="ui-surface-inner mt-5 px-3 py-3">
                  <p className="ui-kicker tracking-[0.14em]">
                    Plan Saat Ini
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">Free Plan</p>
                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    1 link publik per 24 jam.
                  </p>
                  <div className="mt-3">
                    <Button href="/seller/upgrade" size="default" className="w-full">
                      Upgrade ke Pro
                    </Button>
                  </div>
                </div>
              </div>
              <div className="ui-surface-panel p-4">
                <SellerNav />
              </div>
              <div className="ui-surface-panel flex flex-col gap-2 p-4">
                <Button href="/seller/setup" size="default" className="w-full">
                  Aksi Utama: Setup Form
                </Button>
                <Button href="/seller/profile" size="default" variant="secondary" className="w-full">
                  Lengkapi Profil Seller
                </Button>
                <LogoutButton />
              </div>
            </aside>
            <div className="min-w-0 space-y-6">{children}</div>
          </div>
        </SectionContainer>
      </main>
      <AppFooter />
    </div>
  );
}
