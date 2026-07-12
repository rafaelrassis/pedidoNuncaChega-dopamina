import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const comidas = await prisma.comida.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
    select: { id: true },
  });
  return NextResponse.json(comidas);
}
