ALTER TABLE "seller_order_configs"
ADD COLUMN "customFields" JSONB NOT NULL DEFAULT '[]';
