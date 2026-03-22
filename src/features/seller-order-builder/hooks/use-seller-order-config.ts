"use client";

import { useEffect, useRef, useState } from "react";

import { DEFAULT_SELLER_ORDER_CONFIG } from "@/features/shared-order/constants/order.constants";
import type { SellerOrderConfig } from "@/features/shared-order/types/order.types";
import {
  getSellerOrderConfig,
  updateSellerOrderConfig,
} from "@/features/seller-order-builder/api/seller-order-config-api";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useSellerOrderConfig() {
  const [config, setConfig] = useState<SellerOrderConfig>({
    ...DEFAULT_SELLER_ORDER_CONFIG,
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const failedConfigRef = useRef<SellerOrderConfig | null>(null);
  const latestSaveRequestIdRef = useRef(0);
  const hasLocalEditsRef = useRef(false);

  useEffect(() => {
    void getSellerOrderConfig().then((loadedConfig) => {
      if (hasLocalEditsRef.current) {
        return;
      }

      setConfig(loadedConfig);
    });
  }, []);

  async function persistConfig(nextConfig: SellerOrderConfig) {
    const requestId = latestSaveRequestIdRef.current + 1;
    latestSaveRequestIdRef.current = requestId;
    setSaveStatus("saving");
    setSaveErrorMessage(null);

    try {
      const persistedConfig = await updateSellerOrderConfig(nextConfig);

      if (latestSaveRequestIdRef.current !== requestId) {
        return;
      }

      failedConfigRef.current = null;
      setConfig(persistedConfig);
      setSaveStatus("saved");
    } catch {
      if (latestSaveRequestIdRef.current !== requestId) {
        return;
      }

      failedConfigRef.current = nextConfig;
      setSaveStatus("error");
      setSaveErrorMessage("Gagal menyimpan perubahan setup. Coba simpan ulang.");
    }
  }

  function updateConfig(nextConfig: SellerOrderConfig) {
    hasLocalEditsRef.current = true;
    setConfig(nextConfig);
    void persistConfig(nextConfig);
  }

  function retrySave() {
    const retryConfig = failedConfigRef.current ?? config;
    void persistConfig(retryConfig);
  }

  return {
    config,
    retrySave,
    saveErrorMessage,
    saveStatus,
    updateConfig,
  };
}
