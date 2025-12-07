import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/auth";
import { inventorySchema } from "@/lib/validators";

type Params = { params: { id: string } };

async function assertOwner(userId: string, inventoryId: string) {
  const inv = await prisma.inventory.findFirst({
    where: { id: inventoryId, store: { ownerId: userId } }
  });
  return inv;
}

export async function GET(req: NextRequest, { params }: Params) {
  const auth = await getAuthContext(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const inv = await assertOwner(auth.userId, params.id);
  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ inventory: inv });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await getAuthContext(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await assertOwner(auth.userId, params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = inventorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.inventory.update({
    where: { id: params.id },
    data: { quantity: parsed.data.quantity }
  });

  return NextResponse.json({ inventory: updated });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await getAuthContext(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await assertOwner(auth.userId, params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.inventory.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
