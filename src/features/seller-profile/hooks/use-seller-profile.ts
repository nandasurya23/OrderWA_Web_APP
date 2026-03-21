"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getSellerProfile,
  updateSellerProfile,
} from "@/features/seller-profile/api/seller-profile-api";
import type {
  SellerProfile,
  SellerProfileInput,
} from "@/features/seller-profile/types/profile.types";

export function useSellerProfile() {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextProfile = await getSellerProfile();
      setProfile(nextProfile);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal memuat profil seller.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveProfile(input: SellerProfileInput) {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const nextProfile = await updateSellerProfile(input);
      setProfile(nextProfile);
      return nextProfile;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan profil seller.";
      setErrorMessage(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    errorMessage,
    isLoading,
    isSaving,
    profile,
    refresh,
    saveProfile,
  };
}
