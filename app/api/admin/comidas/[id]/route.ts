import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comidaUpdateSchema } from "@/lib/schemas";

type Contexto = { params: { id: string } };

export async function GET(_request: Request, { params }: Contexto) {
  const comida = await prisma.comida.findUnique({ where: { id: params.id } });
  if (!comida) {
    return NextResponse.json({ erro: "Comida não encontrada" }, { status: 404 });
  }
  return NextResponse.json(comida);
}

export async function PUT(request: Request, { params }: Contexto) {
  const body = await request.json().catch(() => null);
  const parsed = comidaUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const comida = await prisma.comida.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json(comida);
  } catch {
    return NextResponse.json({ erro: "Comida não encontrada" }, { status: 404 });
  }
}

export async function PATCH(request: Request, { params }: Contexto) {
  const body = await request.json().catch(() => null);
  const parsed = comidaUpdateSchema.pick({ ativo: true }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  try {
    const comida = await prisma.comida.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json(comida);
  } catch {
    return NextResponse.json({ erro: "Comida não encontrada" }, { status: 404 });
  }
}
