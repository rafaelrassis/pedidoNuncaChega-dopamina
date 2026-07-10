import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import LayoutPublico from "@/components/LayoutPublico";
import ReceitaConteudo from "@/components/ReceitaConteudo";
import { extrairIngredientesEModoPreparo } from "@/lib/receita-jsonld";
import { REGIOES_INFO } from "@/lib/regioes";
import { URL_SITE } from "@/lib/site";

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
    title: `Receita de ${comida.nome}`,
    description: comida.descricao,
    openGraph: {
      title: `Receita de ${comida.nome}`,
      description: comida.descricao,
      images: [comida.fotoUrl],
    },
  };
}

export default async function ReceitaPage({ params }: { params: { slug: string } }) {
  const comida = await prisma.comida.findUnique({ where: { slug: params.slug } });
  if (!comida || !comida.ativo) notFound();

  const { ingredientes, modoPreparo } = extrairIngredientesEModoPreparo(comida.receitaMd);
  const regiaoInfo = REGIOES_INFO.find((r) => r.valor === comida.regiao);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: comida.nome,
    description: comida.descricao,
    image: [`${URL_SITE}${comida.fotoUrl}`],
    recipeCuisine: `Brasileira · ${regiaoInfo?.rotulo ?? comida.regiao}`,
    recipeIngredient: ingredientes,
    recipeInstructions: modoPreparo.map((passo) => ({
      "@type": "HowToStep",
      text: passo,
    })),
  };

  return (
    <LayoutPublico>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
