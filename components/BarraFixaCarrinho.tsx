"use client";

import { useCarrinho } from "./CarrinhoProvider";
import { calcularTotal, contarItens, formatarPreco } from "@/lib/carrinho";

export default function BarraFixaCarrinho() {
  const { itens, abrirCarrinho } = useCarrinho();
  const totalItens = contarItens(itens);

  if (totalItens === 0) return null;

  return (
    <button
      onClick={abrirCarrinho}
      className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-3 rounded-full bg-primaria px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 sm:inset-x-auto sm:right-6"
    >
      <span>
        {totalItens} {totalItens === 1 ? "item" : "itens"} · {formatarPreco(calcularTotal(itens))}
      </span>
      <span>Ver marmita →</span>
    </button>
  );
}
