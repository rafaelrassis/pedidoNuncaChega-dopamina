import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import LayoutPublico from "@/components/LayoutPublico";
import ReceitasIndiceConteudo from "@/components/ReceitasIndiceConteudo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Receitas",
  description:
    "Receitas de verdade dos pratos brasileiros do PedidoNuncaChega, organizadas por região — a comida não vem, mas a receita é real e grátis.",
};

export default async function ReceitasPage() {
  const comidas = await prisma.comida.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
    select: { nome: true, slug: true, regiao: true },
  });

  return (
    <LayoutPublico>
      <ReceitasIndiceConteudo comidas={comidas} />
    </LayoutPublico>
  );
}
