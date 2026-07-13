import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ComidaForm from "@/components/admin/ComidaForm";
import type { GrupoOpcoes } from "@/components/admin/EditorOpcoes";

export default async function EditarComidaPage({
  params,
}: {
  params: { id: string };
}) {
  const comida = await prisma.comida.findUnique({ where: { id: params.id } });
  if (!comida) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Editar comida</h1>
      <ComidaForm
        inicial={{
          id: comida.id,
          nome: comida.nome,
          slug: comida.slug,
          regiao: comida.regiao,
          estado: comida.estado,
          descricao: comida.descricao,
          precoFake: Number(comida.precoFake),
          descontoPct: comida.descontoPct,
          avaliacaoFake: Number(comida.avaliacaoFake),
          numAvaliacoesFake: comida.numAvaliacoesFake,
          tempoPreparoMin: comida.tempoPreparoMin,
          fotoUrl: comida.fotoUrl,
          vegetariano: comida.vegetariano,
          trending: comida.trending,
          best: comida.best,
          opcoesJson: comida.opcoesJson as unknown as GrupoOpcoes[],
          receitaMd: comida.receitaMd,
          ativo: comida.ativo,
        }}
      />
    </div>
  );
}
