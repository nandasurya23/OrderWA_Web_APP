"use client";

import { parseApiResponse } from "@/lib/api/api-client";
import type { SellerOrderConfig } from "@/features/shared-order/types/order.types";

export async function getSellerOrderConfig(): Promise<SellerOrderConfig> {
  const response = await fetch("/api/seller/order-config", {
    cache: "no-store",
    credentials: "include",
    method: "GET",
  });
  const payload = await parseApiResponse<{ config: SellerOrderConfig }>(response);
  return payload.config;
}

export async function updateSellerOrderConfig(config: SellerOrderConfig) {
  const response = await fetch("/api/seller/order-config", {
    body: JSON.stringify({
      closingText: config.closingText,
      customFields: config.customFields,
      fieldOrder: config.fieldOrder,
      openingText: config.openingText,
      showAddress: config.showAddress,
      showNote: config.showNote,
      showPhoneNumber: config.showPhoneNumber,
    }),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    method: "PUT",
  });

  const payload = await parseApiResponse<{ config: SellerOrderConfig }>(response);
  return payload.config;
}
