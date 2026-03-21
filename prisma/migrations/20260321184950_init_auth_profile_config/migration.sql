-- CreateTable
CREATE TABLE "seller_accounts" (
    "id" UUID NOT NULL,
    "sellerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_profiles" (
    "sellerId" UUID NOT NULL,
    "storeName" TEXT NOT NULL,
    "destinationPhoneNumber" TEXT NOT NULL,
    "storeDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_profiles_pkey" PRIMARY KEY ("sellerId")
);

-- CreateTable
CREATE TABLE "seller_order_configs" (
    "sellerId" UUID NOT NULL,
    "openingText" TEXT NOT NULL,
    "closingText" TEXT NOT NULL,
    "showPhoneNumber" BOOLEAN NOT NULL DEFAULT true,
    "showAddress" BOOLEAN NOT NULL DEFAULT true,
    "showNote" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_order_configs_pkey" PRIMARY KEY ("sellerId")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "seller_accounts_email_key" ON "seller_accounts"("email");

-- CreateIndex
CREATE INDEX "idx_seller_accounts_created_at" ON "seller_accounts"("createdAt");

-- CreateIndex
CREATE INDEX "idx_seller_profiles_store_name" ON "seller_profiles"("storeName");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_tokenHash_key" ON "auth_sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "idx_auth_sessions_seller_id" ON "auth_sessions"("sellerId");

-- CreateIndex
CREATE INDEX "idx_auth_sessions_expires_at" ON "auth_sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "public_order_links_token_key" ON "public_order_links"("token");

-- CreateIndex
CREATE INDEX "idx_public_order_links_seller_id" ON "public_order_links"("sellerId");

-- CreateIndex
CREATE INDEX "idx_public_order_links_seller_active" ON "public_order_links"("sellerId", "isActive");

-- AddForeignKey
ALTER TABLE "seller_profiles" ADD CONSTRAINT "seller_profiles_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "seller_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_order_configs" ADD CONSTRAINT "seller_order_configs_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "seller_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "seller_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_order_links" ADD CONSTRAINT "public_order_links_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "seller_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
