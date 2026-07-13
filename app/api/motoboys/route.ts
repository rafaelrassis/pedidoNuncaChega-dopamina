import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const motoboys = await prisma.motoboy.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
    select: {
      id: true,
      nome: true,
      avatarEmoji: true,
      fotoUrl: true,
      frase: true,
      raridade: true,
      pesoSorteio: true,
    },
  });
  return NextResponse.json(motoboys);
}
