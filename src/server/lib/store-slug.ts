import { prisma } from "@/server/db/prisma";

function toBaseSlug(input: string) {
  const normalized = input
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized.length > 0 ? normalized : "toko";
}

export async function generateUniqueStoreSlug(input: {
  sellerId?: string;
  storeName: string;
}) {
  const baseSlug = toBaseSlug(input.storeName);

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
    const existing = await prisma.sellerProfile.findUnique({
      select: { sellerId: true },
      where: { storeSlug: candidate },
    });

    if (!existing || existing.sellerId === input.sellerId) {
      return candidate;
    }
  }

  return `${baseSlug}-${Date.now().toString(36)}`;
}
