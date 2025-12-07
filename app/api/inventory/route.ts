import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/auth";
import { inventorySchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("storeId") ?? undefined;

  const inventory = await prisma.inventory.findMany({
    where: storeId
      ? {
          store: { id: storeId, ownerId: auth.userId }
        }
      : { store: { ownerId: auth.userId } },
    include: { item: true, store: true }
  });

  return NextResponse.json({ inventory });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = inventorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { storeId, itemId, quantity } = parsed.data;

  const store = await prisma.store.findFirst({ where: { id: storeId, ownerId: auth.userId } });
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const record = await prisma.inventory.upsert({
    where: { storeId_itemId: { storeId, itemId } },
    create: { storeId, itemId, quantity },
    update: { quantity }
  });

  return NextResponse.json({ inventory: record }, { status: 201 });
}
