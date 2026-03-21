import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "min-h-12 w-full rounded-[1.15rem] border border-[var(--border)] bg-[rgba(255,255,255,0.92)] px-4 py-3 text-sm text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] placeholder:text-[var(--foreground-muted)] focus-visible:border-[var(--accent)] focus-visible:shadow-[0_0_0_4px_rgba(19,60,112,0.08)]",
        className,
      )}
      {...props}
    />
  );
}
