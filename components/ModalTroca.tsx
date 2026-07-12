"use client";

import { useEffect, useState } from "react";
import { useCarrinho } from "./CarrinhoProvider";

const RARIDADE_ROTULO: Record<string, string> = {
  COMUM: "comum",
  RARO: "raro ✨",
  LENDARIO: "lendário ✨",
};

const MOLDURA_POR_RARIDADE: Record<string, string> = {
  COMUM: "border-2 border-black/10 bg-white",
  RARO: "border-2 border-slate-300 bg-gradient-to-br from-slate-100 via-white to-slate-300 shadow-lg",
  LENDARIO:
    "border-2 border-amber-400 bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 shadow-xl",
};

export default function ModalTroca() {
  const { trocaAberta, trocaRecebida, fecharTroca } = useCarrinho();
  const [virada, setVirada] = useState(false);

  useEffect(() => {
    if (!trocaAberta) {
      setVirada(false);
      return;
    }
    const timer = setTimeout(() => setVirada(true), 500);
    return () => clearTimeout(timer);
  }, [trocaAberta]);

  if (!trocaAberta || !trocaRecebida) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 sm:items-center">
      <div className="flex w-full max-w-lg flex-col gap-5 rounded-t-3xl bg-white p-6 text-center sm:rounded-3xl">
        <div>
          <h2 className="font-display text-2xl font-bold">Troca feita! 🔄</h2>
          <p className="mt-2 text-sm text-foreground/70">
            5 figurinhas repetidas viraram uma garantida raro ou lendária.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="[perspective:800px]">
            <div
              className="relative h-48 w-36 transition-transform duration-700 [transform-style:preserve-3d]"
              style={{ transform: virada ? "rotateY(180deg)" : "rotateY(0deg)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-destaque bg-destaque text-4xl text-white [backface-visibility:hidden]">
                🔄
              </div>
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl p-3 [backface-visibility:hidden] ${MOLDURA_POR_RARIDADE[trocaRecebida.raridade]}`}
                style={{ transform: "rotateY(180deg)" }}
              >
                <span className="absolute -top-2 text-lg">✨</span>
                <span className="text-5xl">{trocaRecebida.avatarEmoji}</span>
                <span className="font-display text-sm font-bold">{trocaRecebida.nome}</span>
                <span className="text-xs text-foreground/60">
                  &ldquo;{trocaRecebida.frase}&rdquo;
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-foreground/50">
                  {RARIDADE_ROTULO[trocaRecebida.raridade]}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={fecharTroca}
          className="rounded-full bg-primaria py-3 font-semibold text-white transition hover:opacity-90"
        >
          Show de bola 🙌
        </button>
      </div>
    </div>
  );
}
