import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-[1.1rem] border border-[var(--border)] bg-[rgba(255,255,255,0.94)] px-4 py-3 text-sm leading-6 text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[var(--foreground-muted)] focus-visible:border-[var(--accent)] focus-visible:bg-[var(--surface)] focus-visible:shadow-[0_0_0_4px_rgba(15,58,114,0.11)] disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)] aria-[invalid=true]:border-[var(--danger)] aria-[invalid=true]:bg-[var(--danger-muted)]",
        className,
      )}
      {...props}
    />
  );
}
