import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionContainer } from "@/components/shared/section-container";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
              description="Masuk untuk lanjut ke profile dan setup order flow tanpa mengubah alur kerja utama."
              eyebrow="Login Seller"
              footerCopy="Belum punya akun?"
              footerHref={nextPath ? `/auth/register?next=${encodeURIComponent(nextPath)}` : "/auth/register"}
              footerLinkLabel="Daftar di sini"
              title="Login seller yang lebih cepat"
            >
              <LoginForm nextPath={nextPath} />
            </AuthShell>
          </FadeIn>
        </SectionContainer>
      </main>
      <AppFooter />
    </div>
  );
}
