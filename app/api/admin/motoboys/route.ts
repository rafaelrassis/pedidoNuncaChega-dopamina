import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { motoboySchema } from "@/lib/schemas";

export async function GET() {
  const motoboys = await prisma.motoboy.findMany({ orderBy: { nome: "asc" } });
  return NextResponse.json(motoboys);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = motoboySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const motoboy = await prisma.motoboy.create({ data: parsed.data });
  return NextResponse.json(motoboy, { status: 201 });
}
