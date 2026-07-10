import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { COOKIE_SESSAO, MAX_AGE_COOKIE_SESSAO, criarTokenSessao } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const corpo = await req.json().catch(() => null);
  const dados = loginSchema.safeParse(corpo);
  if (!dados.success) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({
    where: { email: dados.data.email },
  });
  if (!admin) {
    return NextResponse.json({ erro: "Credenciais inválidas" }, { status: 401 });
  }

  const senhaOk = await bcrypt.compare(dados.data.senha, admin.passwordHash);
  if (!senhaOk) {
    return NextResponse.json({ erro: "Credenciais inválidas" }, { status: 401 });
  }

  const token = await criarTokenSessao({ sub: admin.id, email: admin.email });

  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(COOKIE_SESSAO, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_COOKIE_SESSAO,
  });
  return resposta;
}
