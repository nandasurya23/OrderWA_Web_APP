import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/server/services/public-order-link.service", () => ({
  resolvePublicOrderConfigByStoreSlug: vi.fn(),
}));

import { GET } from "@/app/api/public/order-config/[storeSlug]/route";
import { HttpError } from "@/server/http/errors";
import { resolvePublicOrderConfigByStoreSlug } from "@/server/services/public-order-link.service";

describe("GET /api/public/order-config/[storeSlug]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns config for valid store slug", async () => {
    vi.mocked(resolvePublicOrderConfigByStoreSlug).mockResolvedValueOnce({
      config: {
        closingText: "Thanks",
        customFields: [],
        fieldOrder: [],
        openingText: "Hello",
        showAddress: true,
        showNote: true,
        showPhoneNumber: true,
      },
      seller: {
        destinationPhoneNumber: "62812345",
        storeName: "Toko A",
      },
    });

    const request = new NextRequest("http://localhost/api/public/order-config/toko-a", {
      method: "GET",
    });
    const response = await GET(request, {
      params: Promise.resolve({ storeSlug: "toko-a" }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.data.seller.storeName).toBe("Toko A");
  });

  it("returns 410 when link inactive", async () => {
    vi.mocked(resolvePublicOrderConfigByStoreSlug).mockRejectedValueOnce(
      new HttpError("Link sudah tidak aktif.", {
        code: "LINK_INACTIVE",
        status: 410,
      }),
    );

    const request = new NextRequest("http://localhost/api/public/order-config/toko-a", {
      method: "GET",
    });
    const response = await GET(request, {
      params: Promise.resolve({ storeSlug: "toko-a" }),
    });
    const payload = await response.json();

    expect(response.status).toBe(410);
    expect(payload.error.code).toBe("LINK_INACTIVE");
  });
});
