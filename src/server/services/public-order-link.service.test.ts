import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    $queryRaw: vi.fn(),
    $transaction: vi.fn(),
  },
}));

vi.mock("@/server/db/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/server/repositories/public-order-link.repo", () => ({
  createPublicOrderLink: vi.fn(),
  findLatestPublicLinkBySellerId: vi.fn(),
  findPublicOrderLinkById: vi.fn(),
  updatePublicOrderLinkById: vi.fn(),
}));

vi.mock("@/server/repositories/seller-profile.repo", () => ({
  findSellerProfileBySellerId: vi.fn(),
  findSellerProfileByStoreSlug: vi.fn(),
}));

import { HttpError } from "@/server/http/errors";
import {
  createPublicOrderLink,
  findLatestPublicLinkBySellerId,
} from "@/server/repositories/public-order-link.repo";
import {
  findSellerProfileBySellerId,
  findSellerProfileByStoreSlug,
} from "@/server/repositories/seller-profile.repo";
import {
  createPublicOrderLinkWithSnapshot,
  resolvePublicOrderConfigByStoreSlug,
} from "@/server/services/public-order-link.service";

const fixedNow = new Date("2026-03-22T00:00:00.000Z");

function createSnapshot() {
  return {
    closingText: "Terima kasih",
    destinationPhoneNumber: "08123456789",
    openingText: "Halo",
    showAddress: true,
    showNote: true,
    showPhoneNumber: true,
  };
}

describe("createPublicOrderLinkWithSnapshot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$transaction.mockImplementation(async (callback: (tx: unknown) => unknown) =>
      callback({
        $executeRaw: vi.fn(),
        $queryRaw: vi.fn().mockResolvedValue([{ now: fixedNow }]),
      }),
    );
  });

  it("creates first link when seller has no prior link", async () => {
    vi.mocked(findSellerProfileBySellerId).mockResolvedValueOnce({
      sellerId: "seller-1",
      storeSlug: "toko-surya",
      storeName: "Toko Surya",
      destinationPhoneNumber: "628123",
      storeDescription: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(findLatestPublicLinkBySellerId).mockResolvedValueOnce(null);
    vi.mocked(createPublicOrderLink).mockResolvedValueOnce({
      id: "link-1",
      sellerId: "seller-1",
      token: "token-1",
      configSnapshotJson: {},
      isActive: true,
      createdAt: fixedNow,
      expiresAt: new Date(fixedNow.getTime() + 24 * 60 * 60 * 1000),
    });

    const link = await createPublicOrderLinkWithSnapshot({
      origin: "https://example.com",
      sellerId: "seller-1",
      snapshotConfig: createSnapshot(),
    });

    expect(link.url).toBe("https://example.com/konfirmasi-pesanan/toko-surya");
  });

  it("rejects create inside 24h window", async () => {
    vi.mocked(findSellerProfileBySellerId).mockResolvedValueOnce({
      sellerId: "seller-1",
      storeSlug: "toko-surya",
      storeName: "Toko Surya",
      destinationPhoneNumber: "628123",
      storeDescription: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(findLatestPublicLinkBySellerId).mockResolvedValueOnce({
      id: "link-active",
      sellerId: "seller-1",
      token: "token-active",
      configSnapshotJson: {},
      isActive: true,
      createdAt: new Date("2026-03-21T12:00:00.000Z"),
      expiresAt: new Date("2026-03-22T12:00:00.000Z"),
    });

    await expect(
      createPublicOrderLinkWithSnapshot({
        origin: "https://example.com",
        sellerId: "seller-1",
        snapshotConfig: createSnapshot(),
      }),
    ).rejects.toMatchObject({
      code: "PLAN_LIMIT_REACHED",
      status: 409,
    } satisfies Partial<HttpError>);
  });
});

describe("resolvePublicOrderConfigByStoreSlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$queryRaw.mockResolvedValue([{ now: fixedNow }]);
  });

  it("returns config for valid slug + active link", async () => {
    vi.mocked(findSellerProfileByStoreSlug).mockResolvedValueOnce({
      sellerId: "seller-1",
      storeSlug: "toko-surya",
      storeName: "Toko Surya",
      destinationPhoneNumber: "628123",
      storeDescription: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(findLatestPublicLinkBySellerId).mockResolvedValueOnce({
      id: "link-1",
      sellerId: "seller-1",
      token: "token-1",
      configSnapshotJson: createSnapshot(),
      isActive: true,
      createdAt: new Date("2026-03-21T23:00:00.000Z"),
      expiresAt: new Date("2026-03-22T23:00:00.000Z"),
    });

    const payload = await resolvePublicOrderConfigByStoreSlug("toko-surya");
    expect(payload.seller.storeName).toBe("Toko Surya");
    expect(payload.config.showAddress).toBe(true);
  });

  it("returns LINK_EXPIRED for expired latest link", async () => {
    vi.mocked(findSellerProfileByStoreSlug).mockResolvedValueOnce({
      sellerId: "seller-1",
      storeSlug: "toko-surya",
      storeName: "Toko Surya",
      destinationPhoneNumber: "628123",
      storeDescription: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(findLatestPublicLinkBySellerId).mockResolvedValueOnce({
      id: "link-1",
      sellerId: "seller-1",
      token: "token-1",
      configSnapshotJson: createSnapshot(),
      isActive: true,
      createdAt: new Date("2026-03-20T23:00:00.000Z"),
      expiresAt: new Date("2026-03-21T00:00:00.000Z"),
    });

    await expect(resolvePublicOrderConfigByStoreSlug("toko-surya")).rejects.toMatchObject({
      code: "LINK_EXPIRED",
      status: 410,
    } satisfies Partial<HttpError>);
  });

  it("returns LINK_INACTIVE when latest link is inactive", async () => {
    vi.mocked(findSellerProfileByStoreSlug).mockResolvedValueOnce({
      sellerId: "seller-1",
      storeSlug: "toko-surya",
      storeName: "Toko Surya",
      destinationPhoneNumber: "628123",
      storeDescription: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(findLatestPublicLinkBySellerId).mockResolvedValueOnce({
      id: "link-1",
      sellerId: "seller-1",
      token: "token-1",
      configSnapshotJson: createSnapshot(),
      isActive: false,
      createdAt: new Date("2026-03-20T23:00:00.000Z"),
      expiresAt: new Date("2026-03-22T23:00:00.000Z"),
    });

    await expect(resolvePublicOrderConfigByStoreSlug("toko-surya")).rejects.toMatchObject({
      code: "LINK_INACTIVE",
      status: 410,
    } satisfies Partial<HttpError>);
  });
});
