import { prisma } from "@/server/db/prisma";
import type { Prisma } from "@prisma/client";

let customFieldColumnsEnsured = false;

async function ensureCustomFieldColumns() {
  if (customFieldColumnsEnsured) {
    return;
  }

  await prisma.$executeRawUnsafe(
    `ALTER TABLE "seller_order_configs"
     ADD COLUMN IF NOT EXISTS "customFields" JSONB NOT NULL DEFAULT '[]'::jsonb;`,
  );
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "seller_order_configs"
     ADD COLUMN IF NOT EXISTS "fieldOrder" JSONB NOT NULL DEFAULT '[]'::jsonb;`,
  );

  customFieldColumnsEnsured = true;
}

export async function createSellerOrderConfig(input: {
  closingText: string;
  customFields: Prisma.InputJsonValue;
  fieldOrder: Prisma.InputJsonValue;
  openingText: string;
  sellerId: string;
  showAddress: boolean;
  showNote: boolean;
  showPhoneNumber: boolean;
}) {
  await ensureCustomFieldColumns();

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
    customFields: Prisma.InputJsonValue;
    fieldOrder: Prisma.InputJsonValue;
    openingText: string;
    showAddress: boolean;
    showNote: boolean;
    showPhoneNumber: boolean;
  },
) {
  await ensureCustomFieldColumns();

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
