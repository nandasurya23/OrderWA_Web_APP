import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-[1.25rem] border border-[var(--border)] bg-[rgba(255,255,255,0.92)] px-4 py-3 text-sm text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] placeholder:text-[var(--foreground-muted)] focus-visible:border-[var(--accent)] focus-visible:shadow-[0_0_0_4px_rgba(19,60,112,0.08)]",
        className,
      )}
      {...props}
    />
  );
}
