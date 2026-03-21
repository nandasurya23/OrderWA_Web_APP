import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "large" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,#163e73_0%,#0f2f57_100%)] !text-[var(--accent-foreground)] shadow-[0_16px_36px_rgba(19,60,112,0.18)] hover:translate-y-[-1px] hover:shadow-[0_20px_40px_rgba(19,60,112,0.22)] hover:!text-[var(--accent-foreground)] active:!text-[var(--accent-foreground)] disabled:bg-[var(--accent-muted)] disabled:!text-[var(--foreground-muted)] disabled:shadow-none",
  secondary:
    "border border-[var(--border-strong)] bg-[rgba(255,255,255,0.82)] !text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] hover:border-[var(--accent)] hover:bg-[var(--surface)] hover:!text-[var(--foreground)] active:!text-[var(--foreground)] disabled:!text-[var(--foreground-muted)]",
  ghost:
    "bg-transparent !text-[var(--foreground-muted)] hover:bg-[var(--surface-muted)] hover:!text-[var(--foreground)] active:!text-[var(--foreground)] disabled:!text-[var(--foreground-muted)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "min-h-11 px-4 py-2.5 text-sm",
  large: "min-h-12 px-5 py-3 text-sm sm:text-base",
  icon: "h-11 w-11",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  isLoading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  children,
  disabled,
  href,
  isLoading = false,
  loadingText,
  variant = "primary",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium no-underline transition-[background-color,border-color,color,opacity,transform,box-shadow] duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-100 [&_svg]:shrink-0 [&_svg]:text-current",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classes}
      {...props}
    >
      {isLoading ? (
        <>
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
