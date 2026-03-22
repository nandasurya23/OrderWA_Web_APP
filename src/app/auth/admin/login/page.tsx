import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionContainer } from "@/components/shared/section-container";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

type AdminLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawNextPath = resolvedSearchParams.next;
  const nextPath = Array.isArray(rawNextPath) ? rawNextPath[0] : rawNextPath;

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-12 sm:py-16">
        <SectionContainer>
          <FadeIn>
            <AuthShell
              description="Login khusus admin untuk review request upgrade Pro dan tindakan approval/reject."
              eyebrow="Login Admin"
              footerCopy="Masuk sebagai seller?"
              footerHref="/auth/seller/login"
              footerLinkLabel="Buka login seller"
              title="Akses admin terpisah"
            >
              <LoginForm nextPath={nextPath} mode="admin" />
            </AuthShell>
          </FadeIn>
        </SectionContainer>
      </main>
      <AppFooter />
    </div>
  );
}
