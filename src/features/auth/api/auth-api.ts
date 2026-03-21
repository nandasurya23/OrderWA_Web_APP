"use client";

import { parseApiResponse } from "@/lib/api/api-client";
import type {
  AuthResponse,
  LoginSellerInput,
  RegisterSellerInput,
} from "@/features/auth/types/auth.types";

export async function registerSeller(
  input: RegisterSellerInput,
): Promise<AuthResponse> {
  const response = await fetch("/api/auth/register", {
    body: JSON.stringify(input),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  return parseApiResponse<AuthResponse>(response);
}

export async function loginSeller(
  input: LoginSellerInput,
): Promise<AuthResponse> {
  const response = await fetch("/api/auth/login", {
    body: JSON.stringify(input),
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  return parseApiResponse<AuthResponse>(response);
}

export async function logoutSeller() {
  const response = await fetch("/api/auth/logout", {
    credentials: "include",
    method: "POST",
  });

  await parseApiResponse<{ ok: true }>(response);
}

export async function getCurrentSeller() {
  const response = await fetch("/api/auth/me", {
    cache: "no-store",
    credentials: "include",
    method: "GET",
  });
  const payload = await parseApiResponse<{
    seller: AuthResponse["seller"] | null;
  }>(response);

  return payload.seller;
}
