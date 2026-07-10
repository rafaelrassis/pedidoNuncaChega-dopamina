"use client";

import Link from "next/link";
import { useCarrinho } from "./CarrinhoProvider";
import { contarItens } from "@/lib/carrinho";

export default function Cabecalho() {
  const { itens, abrirCarrinho } = useCarrinho();
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
    </header>
  );
}
