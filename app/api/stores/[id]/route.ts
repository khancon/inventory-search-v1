import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/auth";
import { storeSchema } from "@/lib/validators";

type Params = { params: { id: string } };

async function assertOwner(userId: string, storeId: string) {
  const store = await prisma.store.findFirst({ where: { id: storeId, ownerId: userId } });
  return store;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const store = await prisma.store.findUnique({ where: { id: params.id } });
  if (!store) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ store });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await getAuthContext(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await assertOwner(auth.userId, params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = storeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const store = await prisma.store.update({
    where: { id: params.id },
    data: parsed.data
  });

  return NextResponse.json({ store });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await getAuthContext(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await assertOwner(auth.userId, params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.store.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
