import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comidaUpdateSchema } from "@/lib/validation";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const comida = await prisma.comida.findUnique({ where: { id: params.id } });
  if (!comida) {
    return NextResponse.json({ erro: "Não encontrada" }, { status: 404 });
  }
  return NextResponse.json(comida);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const corpo = await req.json().catch(() => null);
  const dados = comidaUpdateSchema.safeParse(corpo);
  if (!dados.success) {
    return NextResponse.json(
      { erro: "Dados inválidos", detalhes: dados.error.flatten() },
      { status: 400 }
    );
  }

  const atual = await prisma.comida.findUnique({ where: { id: params.id } });
  if (!atual) {
    return NextResponse.json({ erro: "Não encontrada" }, { status: 404 });
  }

  if (dados.data.slug && dados.data.slug !== atual.slug) {
    const conflito = await prisma.comida.findUnique({
      where: { slug: dados.data.slug },
    });
    if (conflito) {
      return NextResponse.json(
        { erro: "Já existe uma comida com esse slug" },
        { status: 409 }
      );
    }
  }

  const comida = await prisma.comida.update({
    where: { id: params.id },
    data: dados.data,
  });
  return NextResponse.json(comida);
}
