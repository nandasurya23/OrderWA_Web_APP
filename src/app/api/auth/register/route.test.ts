import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/server/repositories/seller-account.repo", () => ({
  createSellerAccount: vi.fn(),
  findSellerAccountByEmail: vi.fn(),
}));

vi.mock("@/server/repositories/seller-profile.repo", () => ({
  createSellerProfile: vi.fn(),
}));

vi.mock("@/server/repositories/seller-order-config.repo", () => ({
  createSellerOrderConfig: vi.fn(),
}));

vi.mock("@/server/auth/session", () => ({
  createSellerSession: vi.fn(),
  setSessionCookie: vi.fn(),
}));

vi.mock("@/server/auth/password", () => ({
  hashPassword: vi.fn(() => "hashed-password"),
}));

vi.mock("@/server/lib/store-slug", () => ({
  generateUniqueStoreSlug: vi.fn(async () => "toko-seller-one"),
}));

import { POST } from "@/app/api/auth/register/route";
import { createSellerSession, setSessionCookie } from "@/server/auth/session";
import {
  createSellerAccount,
  findSellerAccountByEmail,
} from "@/server/repositories/seller-account.repo";

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation error when confirmPassword missing", async () => {
    const request = new NextRequest("http://localhost/api/auth/register", {
      body: JSON.stringify({
        email: "seller@test.com",
        password: "secret123",
        sellerName: "Seller One",
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("VALIDATION_ERROR");
    expect(payload.error.fieldErrors.confirmPassword).toBeDefined();
  });

  it("returns success when confirmPassword is provided", async () => {
    vi.mocked(findSellerAccountByEmail).mockResolvedValueOnce(null);
    vi.mocked(createSellerAccount).mockResolvedValueOnce({
      createdAt: new Date(),
      email: "seller@test.com",
      id: "seller-1",
      passwordHash: "hashed-password",
      plan: "FREE",
      sellerName: "Seller One",
      updatedAt: new Date(),
    });
    vi.mocked(createSellerSession).mockResolvedValueOnce({
      expiresAt: new Date(Date.now() + 60_000),
      rawToken: "token",
    });

    const request = new NextRequest("http://localhost/api/auth/register", {
      body: JSON.stringify({
        confirmPassword: "secret123",
        email: "seller@test.com",
        password: "secret123",
        sellerName: "Seller One",
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.seller.email).toBe("seller@test.com");
    expect(setSessionCookie).toHaveBeenCalledTimes(1);
  });
});
