import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionContainer } from "@/components/shared/section-container";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

type RegisterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
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
              description="Buat akun seller agar kamu bisa menyimpan profil toko, mengatur format order, dan membagikan link form ke customer."
              eyebrow="Daftar Seller"
              footerCopy="Sudah punya akun?"
              footerHref={nextPath ? `/auth/login?next=${encodeURIComponent(nextPath)}` : "/auth/login"}
              footerLinkLabel="Masuk di sini"
              title="Buat akun seller baru"
            >
              <RegisterForm nextPath={nextPath} />
            </AuthShell>
          </FadeIn>
        </SectionContainer>
      </main>
      <AppFooter />
    </div>
  );
}
