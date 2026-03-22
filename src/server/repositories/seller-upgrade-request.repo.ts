import { prisma } from "@/server/db/prisma";
import type { Prisma } from "@prisma/client";

type UpgradeRequestDbClient = Prisma.TransactionClient | typeof prisma;

export async function createSellerUpgradeRequest(input: {
  sellerId: string;
  planCode: string;
  priceAmount: number;
  db?: UpgradeRequestDbClient;
}) {
  const db = input.db ?? prisma;

  return db.sellerUpgradeRequest.create({
    data: {
      sellerId: input.sellerId,
      planCode: input.planCode,
      priceAmount: input.priceAmount,
    },
  });
}

export async function findPendingUpgradeRequestBySellerId(
  sellerId: string,
  planCode: string,
  db: UpgradeRequestDbClient = prisma,
) {
  return db.sellerUpgradeRequest.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      sellerId,
      planCode,
      status: "pending",
    },
  });
}

export async function findUpgradeRequestById(id: string) {
  return prisma.sellerUpgradeRequest.findUnique({
    where: { id },
  });
}

export async function findUpgradeRequestByIdWithDb(
  id: string,
  db: UpgradeRequestDbClient,
) {
  return db.sellerUpgradeRequest.findUnique({
    where: { id },
  });
}

export async function listUpgradeRequests(status?: "pending" | "approved" | "rejected") {
  return prisma.sellerUpgradeRequest.findMany({
    include: {
      seller: {
        select: {
          email: true,
          id: true,
          profile: {
            select: {
              storeName: true,
            },
          },
          sellerName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    where: status ? { status } : undefined,
  });
}

export async function updateUpgradeRequestReview(
  id: string,
  input: {
    status: "approved" | "rejected";
    reviewNote?: string | null;
    reviewedAt: Date;
  },
  db: UpgradeRequestDbClient = prisma,
) {
  return db.sellerUpgradeRequest.update({
    data: {
      reviewNote: input.reviewNote ?? null,
      reviewedAt: input.reviewedAt,
      status: input.status,
    },
    where: { id },
  });
}
