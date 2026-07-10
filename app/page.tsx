import { prisma } from "@/lib/prisma";
import PaginaInicialCliente from "@/components/PaginaInicialCliente";
import type { GrupoOpcoes } from "@/lib/tipos";

export const revalidate = 300;

export default async function Home() {
  const comidas = await prisma.comida.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
  });

  const comidasCliente = comidas.map((c) => ({
    id: c.id,
    nome: c.nome,
    slug: c.slug,
    regiao: c.regiao,
    descricao: c.descricao,
    precoFake: Number(c.precoFake),
    descontoPct: c.descontoPct,
    avaliacaoFake: Number(c.avaliacaoFake),
    numAvaliacoesFake: c.numAvaliacoesFake,
    tempoPreparoMin: c.tempoPreparoMin,
    fotoUrl: c.fotoUrl,
    vegetariano: c.vegetariano,
    trending: c.trending,
    best: c.best,
    opcoesJson: c.opcoesJson as unknown as GrupoOpcoes[],
  }));

  return <PaginaInicialCliente comidas={comidasCliente} />;
}
