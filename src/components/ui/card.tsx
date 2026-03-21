import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-[border-color,box-shadow] duration-200 sm:p-8",
        className,
      )}
      {...props}
    />
  );
}
