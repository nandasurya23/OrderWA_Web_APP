import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminHomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-8 sm:py-10">
        <SectionContainer className="space-y-6">
          <Card className="space-y-4 rounded-[1.8rem]">
            <p className="ui-kicker tracking-[0.22em]">Admin</p>
            <h1 className="ui-title text-4xl font-semibold sm:text-5xl">
              Admin Workspace
            </h1>
            <p className="text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
              Pilih modul admin yang tersedia untuk review dan tindakan.
            </p>
          </Card>

          <Card className="space-y-4 rounded-[1.8rem]">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Menu Admin
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/admin/upgrade-requests" size="default">
                Kelola Request Upgrade Pro
              </Button>
            </div>
          </Card>
        </SectionContainer>
      </main>
      <AppFooter />
    </div>
  );
}
