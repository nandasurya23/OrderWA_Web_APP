import { prisma } from "@/server/db/prisma";
import type { Prisma } from "@prisma/client";

type SellerAccountDbClient = Prisma.TransactionClient | typeof prisma;

export async function createSellerAccount(input: {
  email: string;
  passwordHash: string;
  role?: string;
  sellerName: string;
}) {
  return prisma.sellerAccount.create({
    data: {
      email: input.email,
      passwordHash: input.passwordHash,
      ...(input.role ? { role: input.role } : {}),
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

export async function findSellerAccountById(
  id: string,
  db: SellerAccountDbClient = prisma,
) {
  return db.sellerAccount.findUnique({
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

export async function updateSellerAccountPlan(
  sellerId: string,
  input: {
    plan: string;
    proValidUntil: Date | null;
  },
  db: SellerAccountDbClient = prisma,
) {
  return db.sellerAccount.update({
    data: {
      plan: input.plan,
      proValidUntil: input.proValidUntil,
    },
    where: {
      id: sellerId,
    },
  });
}
