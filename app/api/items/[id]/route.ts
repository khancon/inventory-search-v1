import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/auth";
import { itemSchema } from "@/lib/validators";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const item = await prisma.item.findUnique({ where: { id: params.id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const auth = await getAuthContext(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = itemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.item.update({
    where: { id: params.id },
    data: parsed.data
  });

  return NextResponse.json({ item });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await getAuthContext(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.item.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
