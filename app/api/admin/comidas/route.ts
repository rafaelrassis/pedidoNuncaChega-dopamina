import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comidaSchema } from "@/lib/validation";

export async function GET() {
  const comidas = await prisma.comida.findMany({ orderBy: { nome: "asc" } });
  return NextResponse.json(comidas);
}

export async function POST(req: NextRequest) {
  const corpo = await req.json().catch(() => null);
  const dados = comidaSchema.safeParse(corpo);
  if (!dados.success) {
    return NextResponse.json(
      { erro: "Dados inválidos", detalhes: dados.error.flatten() },
      { status: 400 }
    );
  }

  const existente = await prisma.comida.findUnique({
    where: { slug: dados.data.slug },
  });
  if (existente) {
    return NextResponse.json(
      { erro: "Já existe uma comida com esse slug" },
      { status: 409 }
    );
  }

  const comida = await prisma.comida.create({ data: dados.data });
  return NextResponse.json(comida, { status: 201 });
}
