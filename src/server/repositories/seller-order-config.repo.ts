import { prisma } from "@/server/db/prisma";

export async function createSellerOrderConfig(input: {
  closingText: string;
  openingText: string;
  sellerId: string;
  showAddress: boolean;
  showNote: boolean;
  showPhoneNumber: boolean;
}) {
  return prisma.sellerOrderConfig.create({
    data: input,
  });
}

export async function findSellerOrderConfigBySellerId(sellerId: string) {
  return prisma.sellerOrderConfig.findUnique({
    where: {
      sellerId,
    },
  });
}

export async function upsertSellerOrderConfig(
  sellerId: string,
  input: {
    closingText: string;
    openingText: string;
    showAddress: boolean;
    showNote: boolean;
    showPhoneNumber: boolean;
  },
) {
  return prisma.sellerOrderConfig.upsert({
    create: {
      ...input,
      sellerId,
    },
    update: input,
    where: {
      sellerId,
    },
  });
}
