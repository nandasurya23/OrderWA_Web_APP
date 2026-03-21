import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/server/repositories/seller-account.repo", () => ({
  findSellerAccountByEmail: vi.fn(),
}));

vi.mock("@/server/repositories/seller-profile.repo", () => ({
  findSellerProfileBySellerId: vi.fn(),
}));

vi.mock("@/server/auth/password", () => ({
  verifyPassword: vi.fn(),
}));

vi.mock("@/server/auth/session", () => ({
  createSellerSession: vi.fn(),
  setSessionCookie: vi.fn(),
}));

import { POST } from "@/app/api/auth/login/route";
import { findSellerAccountByEmail } from "@/server/repositories/seller-account.repo";
import { findSellerProfileBySellerId } from "@/server/repositories/seller-profile.repo";
import { verifyPassword } from "@/server/auth/password";
import { createSellerSession, setSessionCookie } from "@/server/auth/session";

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 and seller payload for valid credentials", async () => {
    vi.mocked(findSellerAccountByEmail).mockResolvedValueOnce({
      createdAt: new Date(),
      email: "seller@test.com",
      id: "seller-1",
      passwordHash: "hash",
      sellerName: "Seller One",
      updatedAt: new Date(),
    });
    vi.mocked(verifyPassword).mockReturnValueOnce(true);
    vi.mocked(findSellerProfileBySellerId).mockResolvedValueOnce({
      createdAt: new Date(),
      destinationPhoneNumber: "628123",
      sellerId: "seller-1",
      storeDescription: "",
      storeName: "Store One",
      storeSlug: "store-one",
      updatedAt: new Date(),
    });
    vi.mocked(createSellerSession).mockResolvedValueOnce({
      expiresAt: new Date(Date.now() + 60_000),
      rawToken: "token",
    });

    const request = new NextRequest("http://localhost/api/auth/login", {
      body: JSON.stringify({
        email: "seller@test.com",
        password: "secret123",
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
