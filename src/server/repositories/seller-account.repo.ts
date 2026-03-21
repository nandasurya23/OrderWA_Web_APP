import { prisma } from "@/server/db/prisma";

export async function createSellerAccount(input: {
  email: string;
  passwordHash: string;
  sellerName: string;
}) {
  return prisma.sellerAccount.create({
    data: {
      email: input.email,
      passwordHash: input.passwordHash,
      sellerName: input.sellerName,
    },
  });
}

export async function findSellerAccountByEmail(email: string) {
  return prisma.sellerAccount.findUnique({
    where: {
      email,
    },
  });
}

export async function findSellerAccountById(id: string) {
  return prisma.sellerAccount.findUnique({
    where: {
      id,
    },
  });
}

export async function updateSellerAccountIdentity(
  sellerId: string,
  input: {
    email: string;
    sellerName: string;
  },
) {
  return prisma.sellerAccount.update({
    data: {
      email: input.email,
      sellerName: input.sellerName,
    },
    where: {
      id: sellerId,
    },
  });
}
