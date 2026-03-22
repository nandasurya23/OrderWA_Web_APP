ALTER TABLE "seller_accounts"
ADD COLUMN "proValidUntil" TIMESTAMP(3);

CREATE TABLE "seller_upgrade_requests" (
  "id" UUID NOT NULL,
  "sellerId" UUID NOT NULL,
  "planCode" TEXT NOT NULL,
  "priceAmount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'IDR',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "reviewNote" TEXT,
  CONSTRAINT "seller_upgrade_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_seller_upgrade_requests_seller_id"
  ON "seller_upgrade_requests"("sellerId");

CREATE INDEX "idx_seller_upgrade_requests_status"
  ON "seller_upgrade_requests"("status");

CREATE INDEX "idx_seller_upgrade_requests_seller_status"
  ON "seller_upgrade_requests"("sellerId", "status");

ALTER TABLE "seller_upgrade_requests"
ADD CONSTRAINT "seller_upgrade_requests_sellerId_fkey"
FOREIGN KEY ("sellerId") REFERENCES "seller_accounts"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
