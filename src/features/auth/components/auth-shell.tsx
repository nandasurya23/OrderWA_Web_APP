import Link from "next/link";

import { Card } from "@/components/ui/card";

type AuthShellProps = Readonly<{
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  footerCopy: string;
  footerHref: string;
  footerLinkLabel: string;
  title: string;
}>;

export function AuthShell({
  children,
  description,
  eyebrow,
  footerCopy,
  footerHref,
  footerLinkLabel,
  title,
}: AuthShellProps) {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card className="flex flex-col justify-between gap-10 rounded-[2rem] bg-[linear-gradient(180deg,rgba(19,60,112,0.98)_0%,rgba(15,47,87,0.94)_100%)] text-[var(--accent-foreground)] shadow-[0_34px_90px_rgba(19,60,112,0.24)]">
        <div className="space-y-6">
          <div className="inline-flex w-fit rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.08)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgba(246,249,255,0.84)]">
            {eyebrow}
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-md text-sm leading-7 text-[rgba(246,249,255,0.76)] sm:text-base">
              {description}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="rounded-[1.35rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-3">
              <p className="text-sm font-medium">Masuk lebih cepat ke flow seller</p>
              <p className="mt-1 text-sm text-[rgba(246,249,255,0.72)]">
                Profil, setup form, lalu bagikan link ke customer.
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-3">
              <p className="text-sm font-medium">Tanpa ubah logic inti</p>
              <p className="mt-1 text-sm text-[rgba(246,249,255,0.72)]">
                Validasi, CTA, dan alur tetap sama, pengalaman pakainya lebih jelas.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="space-y-8 rounded-[2rem] border-[var(--border)] bg-[rgba(255,255,255,0.84)]">
        {children}

        <p className="text-sm leading-6 text-[var(--foreground-muted)]">
          {footerCopy}{" "}
          <Link
            href={footerHref}
            className="font-semibold text-[var(--accent)] transition-opacity duration-200 hover:opacity-80"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </Card>
    </div>
  );
}
