import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { motoboyUpdateSchema } from "@/lib/schemas";

type Contexto = { params: { id: string } };

export async function GET(_request: Request, { params }: Contexto) {
  const motoboy = await prisma.motoboy.findUnique({ where: { id: params.id } });
  if (!motoboy) {
    return NextResponse.json({ erro: "Motoboy não encontrado" }, { status: 404 });
  }
  return NextResponse.json(motoboy);
}

export async function PUT(request: Request, { params }: Contexto) {
  const body = await request.json().catch(() => null);
  const parsed = motoboyUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const motoboy = await prisma.motoboy.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json(motoboy);
  } catch {
    return NextResponse.json({ erro: "Motoboy não encontrado" }, { status: 404 });
  }
}

export async function PATCH(request: Request, { params }: Contexto) {
  const body = await request.json().catch(() => null);
  const parsed = motoboyUpdateSchema.pick({ ativo: true }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  try {
    const motoboy = await prisma.motoboy.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json(motoboy);
  } catch {
    return NextResponse.json({ erro: "Motoboy não encontrado" }, { status: 404 });
  }
}
