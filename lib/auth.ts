import { NextRequest } from "next/server";
import { supabaseAdmin } from "./supabaseAdmin";

export type AuthContext = {
  userId: string;
  email?: string;
};

export async function getAuthContext(req: NextRequest): Promise<AuthContext | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    console.error("Supabase auth error", error);
    return null;
  }

  return { userId: data.user.id, email: data.user.email ?? undefined };
}
