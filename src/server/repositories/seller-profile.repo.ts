import { prisma } from "@/server/db/prisma";

export async function createSellerProfile(input: {
  destinationPhoneNumber: string;
  sellerId: string;
  storeSlug: string;
  storeDescription: string;
  storeName: string;
}) {
  return prisma.sellerProfile.create({
    data: input,
  });
}

export async function findSellerProfileBySellerId(sellerId: string) {
  return prisma.sellerProfile.findUnique({
    where: {
      sellerId,
    },
  });
}

export async function findSellerProfileByStoreSlug(storeSlug: string) {
  return prisma.sellerProfile.findUnique({
    where: {
      storeSlug,
    },
  });
}

export async function updateSellerProfileBySellerId(
  sellerId: string,
  input: {
    destinationPhoneNumber: string;
    storeSlug?: string;
    storeDescription: string;
    storeName: string;
  },
) {
  return prisma.sellerProfile.update({
    data: input,
    where: {
      sellerId,
    },
  });
}
