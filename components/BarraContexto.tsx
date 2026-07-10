"use client";

import { ENDERECOS_DISPONIVEIS } from "@/lib/tipos";
import { useCarrinho } from "./CarrinhoProvider";

export default function BarraContexto() {
  const { enderecoIndice, trocarEndereco } = useCarrinho();
  const endereco = ENDERECOS_DISPONIVEIS[enderecoIndice];

  return (
    <button
      onClick={trocarEndereco}
      title="Toque para trocar o endereço"
      className="mx-auto flex w-full max-w-fit items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-foreground/70 shadow-sm transition hover:text-primaria sm:text-sm"
    >
      ENTREGAR EM {endereco.emoji} {endereco.texto} · {endereco.tempoMin} min
    </button>
  );
}
