import { prisma } from "@/server/db/prisma";
import type { Prisma } from "@prisma/client";

type PublicOrderLinkDbClient = Prisma.TransactionClient | typeof prisma;

export async function createPublicOrderLink(
  input: {
  configSnapshotJson: Prisma.InputJsonValue;
  createdAt?: Date;
  expiresAt: Date;
  sellerId: string;
  token: string;
},
  db: PublicOrderLinkDbClient = prisma,
) {
  return db.publicOrderLink.create({
    data: input,
  });
}

export async function findLatestPublicLinkBySellerId(
  sellerId: string,
  db: PublicOrderLinkDbClient = prisma,
) {
  return db.publicOrderLink.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    where: { sellerId },
  });
}

export async function findPublicOrderLinkById(
  id: string,
  db: PublicOrderLinkDbClient = prisma,
) {
  return db.publicOrderLink.findUnique({
    where: { id },
  });
}

export async function findPublicOrderLinkByToken(
  token: string,
  db: PublicOrderLinkDbClient = prisma,
) {
  return db.publicOrderLink.findUnique({
    where: { token },
  });
}

export async function findPublicOrderLinkByTokenWithSeller(
  token: string,
  db: PublicOrderLinkDbClient = prisma,
) {
  return db.publicOrderLink.findUnique({
    include: {
      seller: {
        include: {
          profile: {
            select: {
              storeName: true,
            },
          },
        },
      },
    },
    where: { token },
  });
}

export async function updatePublicOrderLinkById(
  id: string,
  input: {
    expiresAt?: Date | null;
    isActive?: boolean;
  },
  db: PublicOrderLinkDbClient = prisma,
) {
  return db.publicOrderLink.update({
    data: input,
    where: { id },
  });
}
