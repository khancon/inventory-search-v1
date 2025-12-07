-- Prisma migration: initial schema for inventory + local search

CREATE TYPE "Role" AS ENUM ('MERCHANT', 'CONSUMER');

CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL UNIQUE,
    "role" "Role" NOT NULL DEFAULT 'CONSUMER',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Store" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ownerId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "hours" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Item" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Inventory" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "storeId" UUID NOT NULL REFERENCES "Store"("id") ON DELETE CASCADE,
    "itemId" UUID NOT NULL REFERENCES "Item"("id") ON DELETE CASCADE,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "Inventory_store_item_idx" ON "Inventory" ("storeId", "itemId");
CREATE INDEX "Store_owner_idx" ON "Store" ("ownerId");
CREATE INDEX "Store_geo_idx" ON "Store" ("latitude", "longitude");

-- Update triggers for updatedAt
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_store_updated_at BEFORE UPDATE ON "Store" FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_item_updated_at BEFORE UPDATE ON "Item" FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER set_inventory_updated_at BEFORE UPDATE ON "Inventory" FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
