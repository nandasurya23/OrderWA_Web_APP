"use client";

import { Copy, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

type OrderActionsProps = {
  copyLabel?: string;
  message: string | null;
  onCopy: () => Promise<void>;
  onPrimaryAction: () => void;
  primaryLabel: string;
  statusMessage: string | null;
};

export function OrderActions({
  copyLabel = "Salin Teks",
  message,
  onCopy,
  onPrimaryAction,
  primaryLabel,
  statusMessage,
}: OrderActionsProps) {
  const hasMessage = Boolean(message);

  return (
    <div className="space-y-4 rounded-[2rem] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.74)] p-5 shadow-[var(--shadow-soft)]">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
          Action
        </p>
        <p className="text-sm leading-6 text-[var(--foreground-muted)]">
          Setelah pesan siap, pilih cara tercepat untuk lanjut.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="secondary"
          className="flex-1"
          disabled={!hasMessage}
          onClick={() => {
            void onCopy();
          }}
        >
          <Copy aria-hidden="true" className="h-4 w-4" />
          {copyLabel}
        </Button>
        <Button className="flex-1" disabled={!hasMessage} onClick={onPrimaryAction}>
          <Send aria-hidden="true" className="h-4 w-4" />
          {primaryLabel}
        </Button>
      </div>
      <p className="text-sm leading-6 text-[var(--foreground-muted)]">
        {statusMessage ?? "Setelah pesan jadi, kamu bisa salin atau langsung kirim ke WhatsApp."}
      </p>
    </div>
  );
}
