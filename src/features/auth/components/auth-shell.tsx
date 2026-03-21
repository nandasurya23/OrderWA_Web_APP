import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";

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
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-stretch">
      <Card className="flex flex-col justify-between gap-10 rounded-[2rem] bg-[linear-gradient(180deg,rgba(18,62,115,0.98)_0%,rgba(13,43,80,0.96)_100%)] text-[var(--accent-foreground)] shadow-[0_32px_82px_rgba(15,58,114,0.26)]">
        <div className="space-y-7">
          <div className="inline-flex w-fit rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.1)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgba(246,249,255,0.86)]">
            {eyebrow}
          </div>
          <div className="space-y-4">
            <h1 className="max-w-[14ch] text-4xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-[36ch] text-sm leading-7 text-[rgba(246,249,255,0.78)] sm:text-base">
              {description}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-[1.25rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-4">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,255,255,0.14)]">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Flow seller tetap sama</p>
              <p className="text-sm text-[rgba(246,249,255,0.74)]">
                Setelah login, langsung lanjut ke profile/setup.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-[1.25rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-4">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,255,255,0.14)]">
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Session tetap server-side</p>
              <p className="text-sm text-[rgba(246,249,255,0.74)]">
                Validasi login dan akses tetap dijaga dari backend.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="space-y-8 rounded-[2rem] border-[var(--border)] bg-[rgba(255,255,255,0.9)]">
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
