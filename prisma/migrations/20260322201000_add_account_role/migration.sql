ALTER TABLE "seller_accounts"
ADD COLUMN "role" TEXT NOT NULL DEFAULT 'SELLER';

CREATE INDEX "idx_seller_accounts_role" ON "seller_accounts"("role");
