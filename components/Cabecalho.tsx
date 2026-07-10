"use client";

import Link from "next/link";
import { useCarrinho } from "./CarrinhoProvider";
import { contarItens } from "@/lib/carrinho";
import BotaoInstalarApp from "./BotaoInstalarApp";

export default function Cabecalho() {
  const { itens, abrirCarrinho, streak } = useCarrinho();
  const totalItens = contarItens(itens);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-black/5 bg-fundo/90 px-6 py-4 backdrop-blur">
      <Link href="/" className="font-display text-xl font-bold text-primaria sm:text-2xl">
        🏍️👻 PedidoNuncaChega
      </Link>
      <nav className="hidden items-center gap-5 text-sm font-medium sm:flex">
        <Link href="/receitas" className="hover:text-primaria">
          Receitas
        </Link>
        <Link href="/blog" className="hover:text-primaria">
          Blog
        </Link>
        <Link href="/sobre" className="hover:text-primaria">
          Sobre
        </Link>
        <Link href="/doar" className="hover:text-primaria">
          Doar
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        {streak.dias > 0 && (
          <span
            title={`${streak.dias} dia${streak.dias === 1 ? "" : "s"} seguidos pedindo`}
            className="flex items-center gap-1 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm"
          >
            🔥 {streak.dias} {streak.dias === 1 ? "dia" : "dias"}
          </span>
        )}
        <BotaoInstalarApp />
        <button
          onClick={abrirCarrinho}
          className="relative rounded-full bg-primaria px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          🍱 Marmita
          {totalItens > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destaque text-xs font-bold text-white">
              {totalItens}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
