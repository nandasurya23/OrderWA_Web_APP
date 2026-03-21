"use client";

import { useEffect, useState } from "react";

import { DEFAULT_SELLER_ORDER_CONFIG } from "@/features/shared-order/constants/order.constants";
import type { SellerOrderConfig } from "@/features/shared-order/types/order.types";
import {
  getSellerOrderConfig,
  updateSellerOrderConfig,
} from "@/features/seller-order-builder/api/seller-order-config-api";

export function useSellerOrderConfig() {
  const [config, setConfig] = useState<SellerOrderConfig>({
    ...DEFAULT_SELLER_ORDER_CONFIG,
  });

  useEffect(() => {
    void getSellerOrderConfig().then(setConfig);
  }, []);

  function updateConfig(nextConfig: SellerOrderConfig) {
    setConfig(nextConfig);
    void updateSellerOrderConfig(nextConfig);
  }

  return {
    config,
    updateConfig,
  };
}
