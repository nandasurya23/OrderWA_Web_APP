import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type FieldProps = HTMLAttributes<HTMLDivElement>;

export function Field({ className, ...props }: FieldProps) {
  return <div className={cn("space-y-2.5", className)} {...props} />;
}

export function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-semibold tracking-[-0.01em] text-[var(--foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export function FieldHint({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm leading-6 text-[var(--foreground-muted)]", className)}
      {...props}
    />
  );
}

export function FieldError({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm leading-6 text-[var(--danger)]", className)}
      {...props}
    />
  );
}

export function FieldControl({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}
