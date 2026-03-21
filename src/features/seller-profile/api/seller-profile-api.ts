"use client";

import { parseApiResponse } from "@/lib/api/api-client";
import type {
  SellerProfile,
  SellerProfileInput,
} from "@/features/seller-profile/types/profile.types";

export async function getSellerProfile(): Promise<SellerProfile> {
  const response = await fetch("/api/seller/profile", {
    cache: "no-store",
    credentials: "include",
    method: "GET",
  });
  const payload = await parseApiResponse<{ profile: SellerProfile }>(response);
  return payload.profile;
}

export async function updateSellerProfile(
  input: SellerProfileInput,
): Promise<SellerProfile> {
  const response = await fetch("/api/seller/profile", {
    body: JSON.stringify(input),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    method: "PUT",
  });

  const payload = await parseApiResponse<{ profile: SellerProfile }>(response);
  return payload.profile;
}
