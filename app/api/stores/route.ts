import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/lib/auth";
import { storeSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stores = await prisma.store.findMany({
    where: { ownerId: auth.userId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ stores });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = storeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const store = await prisma.store.create({
      data: { ...parsed.data, ownerId: auth.userId }
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
