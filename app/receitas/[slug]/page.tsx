import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import LayoutPublico from "@/components/LayoutPublico";
import ReceitaConteudo from "@/components/ReceitaConteudo";

export async function generateStaticParams() {
  const comidas = await prisma.comida.findMany({
    where: { ativo: true },
    select: { slug: true },
  });
  return comidas.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const comida = await prisma.comida.findUnique({ where: { slug: params.slug } });
  if (!comida) return {};
  return {
    title: `Receita de ${comida.nome} · pedidonuncachega`,
    description: comida.descricao,
  };
}

export default async function ReceitaPage({ params }: { params: { slug: string } }) {
  const comida = await prisma.comida.findUnique({ where: { slug: params.slug } });
  if (!comida || !comida.ativo) notFound();

  return (
    <LayoutPublico>
      <ReceitaConteudo
        comida={{
          nome: comida.nome,
          slug: comida.slug,
          descricao: comida.descricao,
          receitaMd: comida.receitaMd,
          fotoUrl: comida.fotoUrl,
        }}
      />
    </LayoutPublico>
  );
}
