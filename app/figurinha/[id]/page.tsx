import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LayoutPublico from "@/components/LayoutPublico";

const RARIDADE_ROTULO: Record<string, string> = {
  COMUM: "comum",
  RARO: "raro ✨",
  LENDARIO: "lendário ✨",
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const motoboy = await prisma.motoboy.findUnique({ where: { id: params.id } });
  if (!motoboy) return {};

  const titulo = `Tirei o ${motoboy.nome}!`;
  const descricao = `"${motoboy.frase}" — figurinha ${RARIDADE_ROTULO[motoboy.raridade]} do PedidoNuncaChega.`;
  const imagem = `/api/figurinha/${motoboy.id}`;

  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      images: [{ url: imagem, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      images: [imagem],
    },
  };
}

export default async function FigurinhaPage({ params }: { params: { id: string } }) {
  const motoboy = await prisma.motoboy.findUnique({ where: { id: params.id } });
  if (!motoboy || !motoboy.ativo) notFound();

  return (
    <LayoutPublico>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center gap-6 px-6 py-10 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/figurinha/${motoboy.id}`}
          alt={`Figurinha de ${motoboy.nome}`}
          className="w-full rounded-2xl shadow-lg"
        />
        <div>
          <h1 className="font-display text-2xl font-bold">{motoboy.nome}</h1>
          <p className="mt-1 text-foreground/70">&ldquo;{motoboy.frase}&rdquo;</p>
          <p className="mt-1 text-sm font-semibold uppercase text-foreground/50">
            {RARIDADE_ROTULO[motoboy.raridade]}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-primaria px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Pedir e tentar tirar essa figurinha 🍽️
        </Link>
      </main>
    </LayoutPublico>
  );
}
