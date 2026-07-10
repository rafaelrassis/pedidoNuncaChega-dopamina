import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(ADMIN_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return resposta;
}
