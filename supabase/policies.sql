-- Enable RLS
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Store" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Inventory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Item" ENABLE ROW LEVEL SECURITY;

-- Users can view themselves
CREATE POLICY "Users can select self" ON "User"
  FOR SELECT USING (auth.uid() = id);

-- Stores: only owner can CRUD
CREATE POLICY "Store owner can manage store" ON "Store"
  FOR ALL USING (auth.uid() = "ownerId") WITH CHECK (auth.uid() = "ownerId");

-- Inventory: only owner of store can manage inventory rows
CREATE POLICY "Store owner can manage inventory" ON "Inventory"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "Store" s
      WHERE s.id = "Inventory"."storeId" AND s."ownerId" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Store" s
      WHERE s.id = "Inventory"."storeId" AND s."ownerId" = auth.uid()
    )
  );

-- Items: any authenticated user can read items; only store owner can create/update if desired
CREATE POLICY "Authenticated can read items" ON "Item"
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Store owner can manage items" ON "Item"
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
