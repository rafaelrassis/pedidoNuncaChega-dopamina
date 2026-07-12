import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verificarTokenAdmin } from "@/lib/auth";
import { senhaSchema } from "@/lib/schemas";

export async function PATCH(request: Request) {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const sessao = token ? await verificarTokenAdmin(token) : null;
  if (!sessao) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = senhaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.issues[0].message }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({ where: { id: sessao.adminId } });
  if (!admin) {
    return NextResponse.json({ erro: "Admin não encontrado" }, { status: 404 });
  }

  const senhaValida = await bcrypt.compare(parsed.data.senhaAtual, admin.passwordHash);
  if (!senhaValida) {
    return NextResponse.json({ erro: "Senha atual incorreta" }, { status: 401 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.novaSenha, 10);
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
