import { Check } from "lucide-react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  description?: string;
  label: string;
};

export function Checkbox({
  checked,
  className,
  description,
  label,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-start gap-4 rounded-[1.35rem] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] px-4 py-4 transition-[border-color,background-color,box-shadow] duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface)]",
        className,
      )}
    >
      <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-md border border-[var(--border-strong)] bg-[var(--surface)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-[border-color,background-color,box-shadow] duration-200 checked:border-[var(--accent)] checked:bg-[linear-gradient(135deg,#163e73_0%,#0f2f57_100%)] focus-visible:outline-none"
          {...props}
        />
        <Check
          aria-hidden="true"
          className="pointer-events-none absolute h-3.5 w-3.5 scale-75 text-[var(--accent-foreground)] opacity-0 transition-all duration-150 peer-checked:scale-100 peer-checked:opacity-100"
        />
      </span>
      <span className="min-w-0 space-y-1">
        <span className="block text-sm font-semibold text-[var(--foreground)]">
          {label}
        </span>
        {description ? (
          <span className="block text-sm leading-6 text-[var(--foreground-muted)]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
