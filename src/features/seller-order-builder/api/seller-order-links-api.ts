"use client";

import { parseApiResponse } from "@/lib/api/api-client";
import type { SellerOrderConfig } from "@/features/shared-order/types/order.types";

export type PublicOrderLinkData = {
  createdAt: string;
  expiresAt: string | null;
  id: string;
  isActive: boolean;
  url: string;
};

type CreateOrderLinkResponse = {
  data: PublicOrderLinkData;
};

type PublicOrderLinkStatusResponse = {
  data: {
    canGenerate: boolean;
    existingLink: PublicOrderLinkData | null;
    nextAvailableAt: string | null;
  };
};

export async function getPublicOrderLinkStatus() {
  const response = await fetch("/api/seller/order-links", {
    cache: "no-store",
    credentials: "include",
    method: "GET",
  });

  const payload = await parseApiResponse<PublicOrderLinkStatusResponse>(response);
  return payload.data;
}

export async function createPublicOrderLink(snapshotConfig: SellerOrderConfig) {
  const response = await fetch("/api/seller/order-links", {
    body: JSON.stringify({ snapshotConfig }),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  const payload = await parseApiResponse<CreateOrderLinkResponse>(response);
  return payload.data;
}

export type PlanLimitErrorMeta = {
  existingLink?: {
    createdAt: string;
    expiresAt: string | null;
    id: string;
    isActive: boolean;
    url: string;
  };
  nextAvailableAt?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function toPlanLimitErrorMeta(meta: unknown): PlanLimitErrorMeta {
  if (!isRecord(meta)) {
    return {};
  }

  const existingLinkValue = meta.existingLink;
  const nextAvailableAtValue = meta.nextAvailableAt;

  let existingLink: PlanLimitErrorMeta["existingLink"];

  if (isRecord(existingLinkValue)) {
    const createdAt = existingLinkValue.createdAt;
    const expiresAt = existingLinkValue.expiresAt;
    const id = existingLinkValue.id;
    const isActive = existingLinkValue.isActive;
    const url = existingLinkValue.url;

    if (
      typeof createdAt === "string" &&
      (typeof expiresAt === "string" || expiresAt === null) &&
      typeof id === "string" &&
      typeof isActive === "boolean" &&
      typeof url === "string"
    ) {
      existingLink = {
        createdAt,
        expiresAt,
        id,
        isActive,
        url,
      };
    }
  }

  return {
    existingLink,
    nextAvailableAt:
      typeof nextAvailableAtValue === "string" ? nextAvailableAtValue : undefined,
  };
}
