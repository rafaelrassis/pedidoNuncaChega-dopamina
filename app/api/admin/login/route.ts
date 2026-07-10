import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { criarTokenAdmin, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  const { email, senha } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email } });
  const senhaValida = admin
    ? await bcrypt.compare(senha, admin.passwordHash)
    : false;

  if (!admin || !senhaValida) {
    return NextResponse.json({ erro: "E-mail ou senha inválidos" }, { status: 401 });
  }

  const token = await criarTokenAdmin({ adminId: admin.id, email: admin.email });

  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return resposta;
}
