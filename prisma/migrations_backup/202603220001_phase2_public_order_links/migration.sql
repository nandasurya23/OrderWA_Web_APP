CREATE TABLE "public_order_links" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "sellerId" UUID NOT NULL,
    "configSnapshotJson" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_order_links_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "public_order_links_token_key" ON "public_order_links"("token");
CREATE INDEX "idx_public_order_links_seller_id" ON "public_order_links"("sellerId");
CREATE INDEX "idx_public_order_links_seller_active" ON "public_order_links"("sellerId", "isActive");

ALTER TABLE "public_order_links"
ADD CONSTRAINT "public_order_links_sellerId_fkey"
FOREIGN KEY ("sellerId") REFERENCES "seller_accounts"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
