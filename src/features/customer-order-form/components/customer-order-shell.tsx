"use client";

import { useState } from "react";
import { Send, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderActions } from "@/features/shared-order/components/order-actions";
import { OrderFormFields } from "@/features/shared-order/components/order-form-fields";
import { OrderResult } from "@/features/shared-order/components/order-result";
import { formatOrderMessage } from "@/features/shared-order/lib/format-order-message";
import { getWhatsAppLink } from "@/features/shared-order/lib/get-whatsapp-link";
import { useOrderForm } from "@/features/shared-order/hooks/use-order-form";
import type {
  OrderFormValues,
  SellerOrderConfig,
} from "@/features/shared-order/types/order.types";

type CustomerOrderShellProps = {
  config: SellerOrderConfig | null;
  invalidLinkCode?: "LINK_EXPIRED" | "LINK_INACTIVE" | "LINK_NOT_FOUND" | "UNKNOWN" | null;
  invalidLinkReason?: string | null;
};

export function CustomerOrderShell({
  config,
  invalidLinkCode,
  invalidLinkReason,
}: CustomerOrderShellProps) {
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!config) {
    const stateLabel =
      invalidLinkCode === "LINK_EXPIRED"
        ? "Link Kedaluwarsa"
        : invalidLinkCode === "LINK_INACTIVE"
        ? "Link Dinonaktifkan"
        : invalidLinkCode === "LINK_NOT_FOUND"
        ? "Link Tidak Ditemukan"
        : "Link Tidak Valid";

    return (
      <Card className="space-y-4 rounded-[2rem]">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--danger-muted)]">
            <TriangleAlert
              aria-hidden="true"
              className="h-4 w-4 text-[var(--danger)]"
            />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
              {stateLabel}
            </p>
            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)]">
              Link form tidak bisa dibuka
            </h2>
            <p className="text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
              {invalidLinkReason ??
                "Link ini tidak lengkap atau sudah rusak. Minta seller mengirim link form yang baru."}
            </p>
            <div className="pt-2">
              <Button href="/" size="default" variant="secondary">
                Kembali ke Homepage
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return <CustomerOrderContent config={config} generatedMessage={generatedMessage} setGeneratedMessage={setGeneratedMessage} statusMessage={statusMessage} setStatusMessage={setStatusMessage} />;
}

type CustomerOrderContentProps = {
  config: SellerOrderConfig;
  generatedMessage: string | null;
  setGeneratedMessage: (message: string | null) => void;
  setStatusMessage: (message: string | null) => void;
  statusMessage: string | null;
};

function CustomerOrderContent({
  config,
  generatedMessage,
  setGeneratedMessage,
  setStatusMessage,
  statusMessage,
}: CustomerOrderContentProps) {
  const {
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    register,
  } = useOrderForm(config);

  const onSubmit = handleSubmit(
    (values: OrderFormValues) => {
      const message = formatOrderMessage(values, {
        config,
      });

      setGeneratedMessage(message);
      setStatusMessage("Pesan order berhasil dibuat.");
      toast.success("Order berhasil dibuat");
    },
    () => {
      toast.error("Form belum valid");
    },
  );

  async function handleCopy() {
    if (!generatedMessage) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedMessage);
      setStatusMessage("Teks berhasil disalin.");
      toast.success("Teks berhasil disalin");
    } catch {
      setStatusMessage("Gagal menyalin teks. Coba lagi.");
      toast.error("Gagal menyalin teks");
    }
  }

  function handleSendWhatsApp() {
    if (!generatedMessage) {
      return;
    }

    const url = getWhatsAppLink(config.destinationPhoneNumber, generatedMessage);

    if (!url) {
      setStatusMessage(
        "Nomor WhatsApp seller belum valid. Minta seller perbarui link form.",
      );
      toast.error("Nomor WhatsApp seller belum valid");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    setStatusMessage("WhatsApp seller siap dibuka dengan pesan order.");
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-start">
      <Card className="rounded-[2rem]">
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
              Form Order
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)]">
              Isi data pesanan
            </h2>
            <p className="text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
              Isi form di bawah ini. Pesan akan dibuat sesuai pengaturan seller.
            </p>
          </div>

          <OrderFormFields config={config} errors={errors} register={register} />

          <div className="space-y-3 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(244,247,251,0.9)] p-5">
            <Button
              size="large"
              className="w-full sm:w-auto"
              type="submit"
              disabled={!isValid}
              isLoading={isSubmitting}
              loadingText="Membuat pesan..."
            >
              <Send aria-hidden="true" className="h-4 w-4" />
              Buat Pesan Order
            </Button>
            <p className="text-sm text-[var(--foreground-muted)]">
              Tombol aktif saat semua kolom yang ditampilkan sudah terisi dengan
              benar.
            </p>
          </div>
        </form>
      </Card>

      <div className="space-y-5 xl:sticky xl:top-28">
        <OrderResult
          description="Pesan ini akan mengikuti teks dan susunan yang sudah diatur seller."
          message={generatedMessage}
          title="Pesan order"
        />
        <OrderActions
          copyLabel="Salin Pesan"
          message={generatedMessage}
          onCopy={handleCopy}
          onPrimaryAction={handleSendWhatsApp}
          primaryLabel="Kirim ke WhatsApp"
          statusMessage={statusMessage}
        />
      </div>
    </section>
  );
}
