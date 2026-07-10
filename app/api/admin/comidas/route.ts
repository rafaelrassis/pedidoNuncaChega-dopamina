import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comidaSchema } from "@/lib/schemas";

export async function GET() {
  const comidas = await prisma.comida.findMany({ orderBy: { nome: "asc" } });
  return NextResponse.json(comidas);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = comidaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const comida = await prisma.comida.create({ data: parsed.data });
    return NextResponse.json(comida, { status: 201 });
  } catch {
    return NextResponse.json({ erro: "Já existe uma comida com esse slug" }, { status: 409 });
  }
}
