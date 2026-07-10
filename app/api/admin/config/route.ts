import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { configSchema } from "@/lib/schemas";

export async function GET() {
  const config = await prisma.configuracao.findUnique({ where: { id: 1 } });
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = configSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 400 });
  }

  const config = await prisma.configuracao.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  return NextResponse.json(config);
}
