"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldControl, FieldLabel } from "@/components/ui/field";
import { SellerConfigSettings } from "@/features/seller-order-builder/components/seller-config-settings";
import { useSellerOrderConfig } from "@/features/seller-order-builder/hooks/use-seller-order-config";
import { useSellerProfile } from "@/features/seller-profile/hooks/use-seller-profile";
import {
  DEFAULT_SELLER_ORDER_CONFIG,
  SELLER_PREVIEW_VALUES,
} from "@/features/shared-order/constants/order.constants";
import { formatOrderMessage } from "@/features/shared-order/lib/format-order-message";
import {
  isValidWhatsAppPhoneNumber,
  normalizePhoneNumber,
} from "@/features/shared-order/lib/normalize-phone-number";
import { OrderResult } from "@/features/shared-order/components/order-result";
import { Input } from "@/components/ui/input";
import {
  createPublicOrderLink,
  getPublicOrderLinkStatus,
  toPlanLimitErrorMeta,
} from "@/features/seller-order-builder/api/seller-order-links-api";
import { ApiClientError } from "@/lib/api/api-client";

export function SellerOrderBuilderShell() {
  const { config, updateConfig } = useSellerOrderConfig();
  const { profile } = useSellerProfile();
  const [copied, setCopied] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isLoadingLinkStatus, setIsLoadingLinkStatus] = useState(true);
  const [nextAvailableAt, setNextAvailableAt] = useState<string | null>(null);
  const [planLimitMessage, setPlanLimitMessage] = useState<string | null>(null);
  const [canGenerateLink, setCanGenerateLink] = useState(true);
  const [shareableLink, setShareableLink] = useState("");
  const [linkExpiresAt, setLinkExpiresAt] = useState<string | null>(null);
  const normalizedDestinationPhoneNumber = normalizePhoneNumber(
    profile?.destinationPhoneNumber,
  );

  const previewMessage = useMemo(
    () =>
      formatOrderMessage(SELLER_PREVIEW_VALUES, {
        config: {
          ...config,
          destinationPhoneNumber:
            normalizedDestinationPhoneNumber ||
            DEFAULT_SELLER_ORDER_CONFIG.destinationPhoneNumber,
        },
      }),
    [config, normalizedDestinationPhoneNumber],
  );

  const hasValidDestinationNumber = isValidWhatsAppPhoneNumber(
    normalizedDestinationPhoneNumber,
  );

  useEffect(() => {
    let isMounted = true;

    void getPublicOrderLinkStatus()
      .then((status) => {
        if (!isMounted) {
          return;
        }

        setCanGenerateLink(status.canGenerate);
        setNextAvailableAt(status.nextAvailableAt);
        setShareableLink(status.existingLink?.url ?? "");
        setLinkExpiresAt(status.existingLink?.expiresAt ?? null);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        toast.error("Gagal memuat status link");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingLinkStatus(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCreateAndCopyLink() {
    if (!hasValidDestinationNumber || !canGenerateLink) {
      return;
    }

    try {
      setIsGeneratingLink(true);
      const link = await createPublicOrderLink({
        ...config,
        destinationPhoneNumber: normalizedDestinationPhoneNumber,
      });

      setShareableLink(link.url);
      setLinkExpiresAt(link.expiresAt);
      setCanGenerateLink(false);
      setNextAvailableAt(link.expiresAt);
      setPlanLimitMessage(null);
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      toast.success("Link form customer berhasil disalin");
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.code === "PLAN_LIMIT_REACHED") {
          const meta = toPlanLimitErrorMeta(error.meta);
          setCanGenerateLink(false);
          setShareableLink(meta.existingLink?.url ?? "");
          setLinkExpiresAt(meta.existingLink?.expiresAt ?? null);
          setNextAvailableAt(meta.nextAvailableAt ?? null);
          setPlanLimitMessage(error.message);
        }

        toast.error(error.message);
      } else {
        toast.error("Gagal membuat link form");
      }
    } finally {
      setIsGeneratingLink(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-start">
        <SellerConfigSettings
          config={config}
          destinationPhoneNumber={profile?.destinationPhoneNumber ?? ""}
          onChange={updateConfig}
        />
        <OrderResult
          description="Contoh ini menunjukkan bentuk pesan yang akan dibuat customer."
          message={previewMessage}
          title="Contoh pesan"
        />
      </div>

      <Card className="space-y-6 rounded-[2rem]">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
            Link Form
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)]">
            Bagikan form ke customer
          </h2>
          <p className="text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
            Link ini sudah membawa pengaturan form yang kamu buat di halaman
            seller.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] p-5">
          <Field>
            <FieldLabel htmlFor="shareableLink">Link customer</FieldLabel>
            <FieldControl>
              <Input id="shareableLink" readOnly value={shareableLink} />
            </FieldControl>
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
              Status link
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
              {canGenerateLink ? "Siap generate link baru" : "Masih dalam cooldown free plan"}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
              Next available
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
              {nextAvailableAt
                ? new Date(nextAvailableAt).toLocaleString("id-ID")
                : "Sekarang"}
            </p>
          </div>
        </div>

        {!normalizedDestinationPhoneNumber ? (
          <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--foreground-muted)]">
            Lengkapi dulu nomor WhatsApp tujuan di{" "}
            <Link
              href="/seller/profile"
              className="font-semibold text-[var(--accent)] transition-opacity duration-200 hover:opacity-80"
            >
              profil seller
            </Link>{" "}
            agar link customer bisa dibuat.
          </div>
        ) : null}

        <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(244,247,251,0.9)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            className="w-full sm:w-auto"
            disabled={!hasValidDestinationNumber || !canGenerateLink || isLoadingLinkStatus}
            onClick={() => void handleCreateAndCopyLink()}
            size="large"
            isLoading={isGeneratingLink || isLoadingLinkStatus}
            loadingText="Membuat link..."
          >
            Buat & Salin Link
          </Button>
          <p className="max-w-xl text-sm leading-6 text-[var(--foreground-muted)]">
            {!hasValidDestinationNumber
              ? "Isi nomor WhatsApp seller yang valid di profil agar link bisa dibuat."
              : !canGenerateLink && nextAvailableAt
              ? `Batas free plan aktif. Bisa buat link baru setelah ${new Date(nextAvailableAt).toLocaleString("id-ID")}.`
              : copied
              ? "Link token aktif sudah siap dibagikan."
              : "Setiap klik akan membuat link token baru dengan snapshot terbaru."}
          </p>
        </div>
        {planLimitMessage ? (
          <p className="text-sm text-[var(--foreground-muted)]">{planLimitMessage}</p>
        ) : null}
        {linkExpiresAt ? (
          <p className="text-sm text-[var(--foreground-muted)]">
            Link aktif berlaku sampai {new Date(linkExpiresAt).toLocaleString("id-ID")}.
          </p>
        ) : null}
      </Card>
    </section>
  );
}
