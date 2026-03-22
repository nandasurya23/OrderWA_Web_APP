"use client";

import { CheckCircle2, CreditCard, Gem, MessageSquareText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApiClientError, parseApiResponse } from "@/lib/api/api-client";

const proPlanItems = [
  "Tanpa watermark pada output pesan",
  "Arah multi-link aktif & limit generate lebih longgar",
  "Arah advanced customization seller workflow",
];

export default function SellerUpgradeCheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestState, setRequestState] = useState<{
    id: string;
    status: string;
    created: boolean;
    planCode: string;
    priceAmount: number;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    void (async () => {
      try {
        const response = await fetch("/api/seller/upgrade", {
          cache: "no-store",
          credentials: "include",
          method: "GET",
        });
        const payload = await parseApiResponse<{
          data: {
            id: string;
            status: string;
            planCode: string;
            priceAmount: number;
          } | null;
        }>(response);

        if (!mounted || !payload.data) {
          return;
        }

        setRequestState({
          id: payload.data.id,
          status: payload.data.status,
          created: false,
          planCode: payload.data.planCode,
          priceAmount: payload.data.priceAmount,
        });
      } catch {
        // noop: page still usable even if status fetch fails
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleCreateUpgradeRequest() {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/seller/upgrade", {
        credentials: "include",
        method: "POST",
      });
      const payload = await parseApiResponse<{
        data: {
          created: boolean;
          request: {
            id: string;
            status: string;
            planCode: string;
            priceAmount: number;
          };
        };
      }>(response);

      setRequestState({
        id: payload.data.request.id,
        status: payload.data.request.status,
        created: payload.data.created,
        planCode: payload.data.request.planCode,
        priceAmount: payload.data.request.priceAmount,
      });
      toast.success(
        payload.data.created
          ? "Request upgrade Pro berhasil dibuat."
          : "Request pending sudah ada. Tim admin akan meninjau.",
      );
    } catch (error) {
      if (error instanceof ApiClientError && error.code === "PRO_ALREADY_ACTIVE") {
        toast.error("Pro masih aktif. Request baru belum diperlukan.");
        return;
      }

      toast.error("Gagal membuat request upgrade Pro.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn className="ui-hero-panel px-6 py-7 sm:px-8 sm:py-8">
        <div className="space-y-4">
          <p className="ui-kicker tracking-[0.22em]">Checkout Pro</p>
          <h1 className="ui-title max-w-[16ch] text-4xl font-semibold sm:text-5xl">
            Aktivasi Pro dengan alur manual yang jelas.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--foreground-muted)] sm:text-lg">
            Gateway pembayaran otomatis belum aktif. Halaman ini berfungsi sebagai langkah checkout
            manual agar seller tetap punya next step yang nyata.
          </p>
        </div>
      </FadeIn>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="space-y-4 rounded-[1.8rem]">
          <p className="ui-kicker tracking-[0.16em]">Ringkasan Plan</p>
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-[var(--foreground)]">
            <Gem aria-hidden="true" className="h-5 w-5 text-[var(--accent)]" />
            Pro Plan
          </h2>
          <div className="space-y-2">
            {proPlanItems.map((item) => (
              <p key={item} className="flex items-start gap-2 text-sm text-[var(--foreground-muted)]">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                <span>{item}</span>
              </p>
            ))}
          </div>
          <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
              Harga
            </p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Rp50.000 (default harga Pro saat ini).
            </p>
          </div>
        </Card>

        <Card className="space-y-4 rounded-[1.8rem]">
          <p className="ui-kicker tracking-[0.16em]">Pembayaran & Konfirmasi</p>
          <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--foreground-muted)]">
            <p className="flex items-start gap-2">
              <CreditCard aria-hidden="true" className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
              Metode pembayaran diberikan manual setelah pengajuan aktivasi diproses admin.
            </p>
            <p className="mt-3 flex items-start gap-2">
              <MessageSquareText aria-hidden="true" className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
              Kanal kontak admin/WhatsApp khusus pembayaran belum dikonfigurasi di codebase saat ini.
            </p>
          </div>
          <div className="space-y-2 text-sm text-[var(--foreground-muted)]">
            <p>Langkah berikutnya:</p>
            <p>1. Ajukan aktivasi Pro lewat tombol di bawah.</p>
            <p>2. Tunggu instruksi pembayaran manual dari admin.</p>
            <p>3. Konfirmasi pembayaran untuk aktivasi plan.</p>
          </div>
          {requestState ? (
            <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground-muted)]">
              <p>
                Plan: <span className="font-semibold text-[var(--foreground)]">{requestState.planCode}</span>
              </p>
              <p>
                Harga: <span className="font-semibold text-[var(--foreground)]">Rp{requestState.priceAmount.toLocaleString("id-ID")}</span>
              </p>
              <p>
                Status: <span className="font-semibold text-[var(--foreground)]">{requestState.status === "pending" ? "pending approval" : requestState.status}</span>
              </p>
              <p>
                Request ID: <span className="font-semibold text-[var(--foreground)]">{requestState.id}</span>
              </p>
            </div>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              onClick={() => void handleCreateUpgradeRequest()}
              size="default"
              className="w-full sm:w-auto"
              isLoading={isSubmitting}
              loadingText="Membuat request..."
            >
              {requestState ? "Request Sudah Dikirim" : "Ajukan Aktivasi ke Admin"}
            </Button>
            <Button href="/seller/upgrade" size="default" variant="secondary" className="w-full sm:w-auto">
              Kembali ke Detail Upgrade
            </Button>
            <Button href="/seller" size="default" variant="ghost" className="w-full sm:w-auto">
              Saya Sudah Mengajukan
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
