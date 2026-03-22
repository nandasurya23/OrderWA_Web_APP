"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { parseApiResponse } from "@/lib/api/api-client";

type RequestStatus = "pending" | "approved" | "rejected";

type UpgradeRequestRow = {
  id: string;
  sellerName: string;
  storeName: string;
  sellerEmail: string;
  planCode: string;
  priceAmount: number;
  currency: string;
  status: RequestStatus;
  createdAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
};

export default function AdminUpgradeRequestsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingId, setIsSubmittingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | RequestStatus>("pending");
  const [rows, setRows] = useState<UpgradeRequestRow[]>([]);

  async function loadData(filter: "all" | RequestStatus) {
    setIsLoading(true);
    try {
      const query = filter === "all" ? "" : `?status=${filter}`;
      const response = await fetch(`/api/admin/upgrade-requests${query}`, {
        cache: "no-store",
        credentials: "include",
        method: "GET",
      });
      const payload = await parseApiResponse<{ data: UpgradeRequestRow[] }>(response);
      setRows(payload.data);
    } catch {
      toast.error("Gagal memuat request upgrade.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData(statusFilter);
  }, [statusFilter]);

  async function handleReview(id: string, decision: "approved" | "rejected") {
    try {
      setIsSubmittingId(id);
      const response = await fetch(`/api/admin/upgrade-requests/${id}`, {
        body: JSON.stringify({ decision }),
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        method: "PATCH",
      });
      await parseApiResponse(response);
      toast.success(decision === "approved" ? "Request berhasil di-approve." : "Request berhasil di-reject.");
      await loadData(statusFilter);
    } catch {
      toast.error("Gagal memproses request.");
    } finally {
      setIsSubmittingId(null);
    }
  }

  const title = useMemo(
    () =>
      statusFilter === "all"
        ? "Semua Request Upgrade"
        : statusFilter === "pending"
        ? "Request Pending"
        : statusFilter === "approved"
        ? "Request Approved"
        : "Request Rejected",
    [statusFilter],
  );

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-8 sm:py-10">
        <SectionContainer className="space-y-6">
          <Card className="space-y-4 rounded-[1.8rem]">
            <p className="ui-kicker tracking-[0.22em]">Admin</p>
            <h1 className="ui-title text-4xl font-semibold sm:text-5xl">Kelola Upgrade Pro Seller</h1>
            <p className="text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
              Review request upgrade Pro, approve/reject, dan pantau status invoice/request seller.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="default" variant="ghost" href="/admin">
                Dashboard Admin
              </Button>
              <Button
                size="default"
                variant={statusFilter === "pending" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Button>
              <Button
                size="default"
                variant={statusFilter === "approved" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("approved")}
              >
                Approved
              </Button>
              <Button
                size="default"
                variant={statusFilter === "rejected" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("rejected")}
              >
                Rejected
              </Button>
              <Button
                size="default"
                variant={statusFilter === "all" ? "primary" : "secondary"}
                onClick={() => setStatusFilter("all")}
              >
                Semua
              </Button>
            </div>
          </Card>

          <Card className="space-y-4 rounded-[1.8rem]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
              <Button size="default" variant="ghost" onClick={() => void loadData(statusFilter)}>
                Refresh
              </Button>
            </div>

            {isLoading ? (
              <p className="text-sm text-[var(--foreground-muted)]">Memuat data request...</p>
            ) : rows.length === 0 ? (
              <p className="text-sm text-[var(--foreground-muted)]">Belum ada request untuk filter ini.</p>
            ) : (
              <div className="space-y-3">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
                  >
                    <div className="grid gap-3 text-sm text-[var(--foreground-muted)] sm:grid-cols-2 xl:grid-cols-3">
                      <p>Seller: <span className="font-semibold text-[var(--foreground)]">{row.sellerName}</span></p>
                      <p>Toko: <span className="font-semibold text-[var(--foreground)]">{row.storeName}</span></p>
                      <p>Email: <span className="font-semibold text-[var(--foreground)]">{row.sellerEmail}</span></p>
                      <p>Plan: <span className="font-semibold text-[var(--foreground)]">{row.planCode}</span></p>
                      <p>Harga: <span className="font-semibold text-[var(--foreground)]">Rp{row.priceAmount.toLocaleString("id-ID")}</span></p>
                      <p>Status: <span className="font-semibold text-[var(--foreground)]">{row.status}</span></p>
                      <p>Tanggal Request: <span className="font-semibold text-[var(--foreground)]">{new Date(row.createdAt).toLocaleString("id-ID")}</span></p>
                    </div>
                    {row.status === "pending" ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="default"
                          onClick={() => void handleReview(row.id, "approved")}
                          isLoading={isSubmittingId === row.id}
                          loadingText="Memproses..."
                        >
                          Approve
                        </Button>
                        <Button
                          size="default"
                          variant="secondary"
                          onClick={() => void handleReview(row.id, "rejected")}
                          disabled={isSubmittingId === row.id}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </SectionContainer>
      </main>
      <AppFooter />
    </div>
  );
}
