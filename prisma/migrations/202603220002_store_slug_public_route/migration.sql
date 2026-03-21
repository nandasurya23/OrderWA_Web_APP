ALTER TABLE "seller_profiles" ADD COLUMN "storeSlug" TEXT;

UPDATE "seller_profiles"
SET "storeSlug" = lower(trim(both '-' from regexp_replace("storeName", '[^a-zA-Z0-9]+', '-', 'g')))
WHERE "storeSlug" IS NULL;

UPDATE "seller_profiles"
SET "storeSlug" = concat(
  COALESCE(NULLIF("storeSlug", ''), 'toko'),
  '-',
  left(replace("sellerId"::text, '-', ''), 6)
)
WHERE "storeSlug" IS NULL OR "storeSlug" = '';

ALTER TABLE "seller_profiles" ALTER COLUMN "storeSlug" SET NOT NULL;

CREATE UNIQUE INDEX "seller_profiles_storeSlug_key" ON "seller_profiles"("storeSlug");
CREATE INDEX "idx_seller_profiles_store_slug" ON "seller_profiles"("storeSlug");
