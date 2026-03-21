"use client";

import { Toaster } from "sonner";

export function SonnerProvider() {
  return (
    <Toaster
      position="top-center"
      richColors={false}
      toastOptions={{
        className: "!border !border-[var(--border)] !bg-[var(--surface)] !text-[var(--foreground)]",
      }}
    />
  );
}
