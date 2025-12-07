import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { signupSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { email, password, role } = parsed.data;

    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL }
    });

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message ?? "Signup failed" }, { status: 400 });
    }

    await prisma.user.upsert({
      where: { id: data.user.id },
      update: { email, role },
      create: { id: data.user.id, email, role }
    });

    return NextResponse.json({ userId: data.user.id, email, role }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
