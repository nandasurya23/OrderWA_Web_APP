import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { SectionContainer } from "@/components/shared/section-container";
import { SellerNav } from "@/components/shared/seller-nav";
import { LogoutButton } from "@/features/auth/components/logout-button";

type SellerLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function SellerLayout({ children }: SellerLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <div className="border-b border-[var(--border-soft)] bg-[rgba(255,255,255,0.48)]">
        <SectionContainer className="flex flex-col gap-5 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
                Seller Workspace
              </p>
              <h1 className="text-3xl font-semibold leading-tight tracking-[-0.05em] text-[var(--foreground)] sm:text-4xl">
                Kelola profil, format order, dan link customer dalam satu alur.
              </h1>
              <p className="text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
                Lengkapi nomor tujuan, atur bentuk pesan, lalu bagikan link form
                yang siap dipakai customer.
              </p>
            </div>
            <LogoutButton />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
                Fokus Hari Ini
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                Pastikan profil lengkap lalu generate link konfirmasi aktif.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
                Rule Free Plan
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                1 link publik per 24 jam, expiry otomatis dari backend.
              </p>
            </div>
          </div>

          <SellerNav />
        </SectionContainer>
      </div>
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
