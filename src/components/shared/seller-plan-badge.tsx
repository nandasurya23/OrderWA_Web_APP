"use client";

import { useEffect, useState } from "react";

import { parseApiResponse } from "@/lib/api/api-client";
import { getCurrentSeller } from "@/features/auth/api/auth-api";
import { Button } from "@/components/ui/button";

type PendingUpgradeResponse = {
  data: {
    id: string;
    status: "pending" | "approved" | "rejected";
    planCode: string;
    priceAmount: number;
    currency: string;
    createdAt: string;
  } | null;
};

function formatPlanLabel(plan: string | null) {
  if (!plan) {
    return "Plan belum tersedia";
  }

  if (plan === "FREE") {
    return "Free Plan";
  }

  if (plan === "PRO") {
    return "Pro Plan";
  }

  return `${plan} Plan`;
}

function formatActiveUntil(dateValue: string | null) {
  if (!dateValue) {
    return null;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

type SellerPlanState = "free" | "pending" | "pro" | "unknown";

function resolvePlanState(input: {
  plan: string | null;
  pendingStatus: "pending" | "approved" | "rejected" | null;
}): SellerPlanState {
  if (input.plan === "PRO") {
    return "pro";
  }

  if (input.pendingStatus === "pending") {
    return "pending";
  }

  if (input.plan === "FREE") {
    return "free";
  }

  return "unknown";
}

function planActionText(input: {
  state: SellerPlanState;
  proValidUntil: string | null;
}) {
  if (input.state === "pro") {
    const activeUntil = formatActiveUntil(input.proValidUntil);
    return activeUntil ? `Aktif sampai ${activeUntil}` : "Pro aktif";
  }

  if (input.state === "pending") {
    return "Menunggu persetujuan admin";
  }

  if (input.state === "free") {
    return "Upgrade Pro";
  }

  return "Status plan belum tersedia";
}

export function SellerPlanBadge() {
  const [plan, setPlan] = useState<string | null>(null);
  const [proValidUntil, setProValidUntil] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<
    "pending" | "approved" | "rejected" | null
  >(null);

  useEffect(() => {
    let mounted = true;

    void Promise.all([
      getCurrentSeller(),
      fetch("/api/seller/upgrade", {
        cache: "no-store",
        credentials: "include",
        method: "GET",
      })
        .then((response) =>
          parseApiResponse<PendingUpgradeResponse>(response),
        )
        .then((payload) => payload.data)
        .catch(() => null),
    ])
      .then(([seller, pending]) => {
        if (!mounted) {
          return;
        }

        setPlan(seller?.plan ?? null);
        setProValidUntil(seller?.proValidUntil ?? null);
        setPendingStatus(pending?.status ?? null);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setPlan(null);
        setProValidUntil(null);
        setPendingStatus(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const state = resolvePlanState({ plan, pendingStatus });
  const actionText = planActionText({ proValidUntil, state });
  const showUpgradeButton = state === "free";

  return (
    <div className="space-y-2">
      <span className="inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm font-semibold text-[var(--foreground)]">
        {state === "pending" ? "Pro Pending" : formatPlanLabel(plan)}
      </span>
      <p className="text-xs text-[var(--foreground-muted)]">{actionText}</p>
      {showUpgradeButton ? (
        <Button href="/seller/upgrade" size="default" className="w-full sm:w-auto">
          Upgrade Pro
        </Button>
      ) : null}
    </div>
  );
}
