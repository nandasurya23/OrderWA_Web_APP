"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getPublicOrderLinkStatus,
  type PublicOrderLinkData,
  type PublicOrderLinkHistoryItem,
} from "@/features/seller-order-builder/api/seller-order-links-api";

function formatCooldownLabel(nextAvailableAt: string | null, now: number, canGenerate: boolean) {
  if (!nextAvailableAt || canGenerate) {
    return "Siap sekarang";
  }

  const remainingMs = new Date(nextAvailableAt).getTime() - now;

  if (remainingMs <= 0) {
    return "Siap sekarang";
  }

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

export function SellerDashboardShell() {
  const [isLoading, setIsLoading] = useState(true);
  const [canGenerateLink, setCanGenerateLink] = useState(true);
  const [nextAvailableAt, setNextAvailableAt] = useState<string | null>(null);
  const [existingLink, setExistingLink] = useState<PublicOrderLinkData | null>(null);
  const [history, setHistory] = useState<PublicOrderLinkHistoryItem[]>([]);
  const [now, setNow] = useState(() => Date.now());

  const cooldownLabel = useMemo(
    () => formatCooldownLabel(nextAvailableAt, now, canGenerateLink),
    [canGenerateLink, nextAvailableAt, now],
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
        setExistingLink(status.existingLink);
        setHistory(status.history);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        toast.error("Gagal memuat dashboard seller");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!nextAvailableAt || canGenerateLink) {
      return;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [canGenerateLink, nextAvailableAt]);

  const activeLinkStatus = existingLink && existingLink.isActive ? "Aktif" : "Belum ada link aktif";

  return (
    <section className="space-y-6">
      <div className="grid gap-3 lg:grid-cols-3">
        <Button href="/seller/setup" size="default">
          Aksi Utama: Setup & Generate Link
        </Button>
        <Button href="/seller/profile" size="default" variant="secondary">
          Lengkapi Profil
        </Button>
        <Button href="/seller/setup" size="default" variant="ghost">
          Buka Link Workspace
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="space-y-2 rounded-[1.5rem] p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
            Status Link Aktif
          </p>
          <p className="text-base font-semibold text-[var(--foreground)]">
            {isLoading ? "Memuat..." : activeLinkStatus}
          </p>
        </Card>

        <Card className="space-y-2 rounded-[1.5rem] p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
            Kedaluwarsa Link
          </p>
          <p className="text-base font-semibold text-[var(--foreground)]">
            {isLoading
              ? "Memuat..."
              : existingLink?.expiresAt
              ? new Date(existingLink.expiresAt).toLocaleString("id-ID")
              : "Belum ada"}
          </p>
        </Card>

        <Card className="space-y-2 rounded-[1.5rem] p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
            Cooldown Generate
          </p>
          <p className="text-base font-semibold text-[var(--foreground)]">
            {isLoading ? "Memuat..." : cooldownLabel}
          </p>
          <p className="text-xs text-[var(--foreground-muted)]">
            Free plan: 1 link/24 jam. Pro: limit lebih longgar.
          </p>
        </Card>
      </div>

      <Card className="space-y-4 rounded-[1.8rem]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
              Plan Saat Ini
            </p>
            <p className="mt-2 inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm font-semibold text-[var(--foreground)]">
              Free Plan
            </p>
            <p className="mt-2 text-xs text-[var(--foreground-muted)]">
              Watermark aktif di free plan. Pro mendukung tanpa watermark.
            </p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Terkunci untuk pro: multi-link aktif & advanced customization.
            </p>
          </div>
          <Button href="/seller/setup" size="default" variant="secondary">
            Buka Setup Form
          </Button>
        </div>
      </Card>

      <Card className="space-y-4 rounded-[1.8rem]">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
            Riwayat Link
          </p>
          <p className="text-sm text-[var(--foreground-muted)]">
            Aktivitas terbaru untuk memantau link aktif dan masa berlakunya.
          </p>
        </div>
        {isLoading ? (
          <p className="text-sm text-[var(--foreground-muted)]">Memuat riwayat...</p>
        ) : history.length > 0 ? (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-[1rem] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <p>Dibuat: {new Date(item.createdAt).toLocaleString("id-ID")}</p>
                  <p>
                    Kedaluwarsa:{" "}
                    {item.expiresAt
                      ? new Date(item.expiresAt).toLocaleString("id-ID")
                      : "-"}
                  </p>
                  <p>
                    Status:{" "}
                    <span className="font-semibold text-[var(--foreground)]">
                      {item.status === "active" ? "Aktif" : "Kedaluwarsa"}
                    </span>
                  </p>
                  <p className="break-all">
                    URL:{" "}
                    <Link
                      href={item.url}
                      className="font-semibold text-[var(--accent)] hover:opacity-80"
                    >
                      {item.url}
                    </Link>
                  </p>
                </div>
                <Button
                  className="w-full sm:w-auto"
                  size="default"
                  variant="secondary"
                  onClick={() => {
                    void navigator.clipboard.writeText(item.url).then(() => {
                      toast.success("Link berhasil disalin");
                    }).catch(() => {
                      toast.error("Gagal menyalin link");
                    });
                  }}
                >
                  Salin Link
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <p className="text-sm text-[var(--foreground-muted)]">
              Belum ada riwayat link. Mulai dari setup untuk membuat link pertamamu.
            </p>
            <div className="mt-3">
              <Button href="/seller/setup" size="default">
                Buat Link Pertama
              </Button>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
