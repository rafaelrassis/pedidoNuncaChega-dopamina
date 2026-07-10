"use client";

import { useEffect, useMemo, useState } from "react";
import { useCarrinho } from "./CarrinhoProvider";
import { formatarPreco } from "@/lib/carrinho";
import { calcularAlbum } from "@/lib/album";
import { calcularRegioesColetadas, TODAS_REGIOES } from "@/lib/passaporte";
import { REGIOES_INFO } from "@/lib/regioes";
import DoacaoCard from "./DoacaoCard";

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

export default function ModalEntrega() {
  const { pedidoAtual, entregaAberta, fecharEntrega, pedidos, motoboys } = useCarrinho();
  const [virada, setVirada] = useState(false);

  useEffect(() => {
    if (!entregaAberta) {
      setVirada(false);
      return;
    }
    const timer = setTimeout(() => setVirada(true), 500);
    return () => clearTimeout(timer);
  }, [entregaAberta, pedidoAtual?.id]);

  const album = useMemo(() => calcularAlbum(pedidos), [pedidos]);
  const regioesColetadas = useMemo(() => calcularRegioesColetadas(pedidos), [pedidos]);

  if (!entregaAberta || !pedidoAtual) return null;

  const entrada = album.get(pedidoAtual.motoboy.id);
  const repetida = (entrada?.quantidade ?? 0) > 1;
  const faltamRegioes = TODAS_REGIOES.length - regioesColetadas.size;
  const totalMotoboys = motoboys.length || 12;

  async function compartilharFigurinha() {
    if (!pedidoAtual) return;
    const texto = `Tirei o ${pedidoAtual.motoboy.nome} ${RARIDADE_ROTULO[pedidoAtual.motoboy.raridade]} no PedidoNuncaChega! ${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: texto });
      } catch {
        // usuário cancelou o compartilhamento
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // ambiente sem permissão de clipboard
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl">
        <div className="flex flex-col gap-5 p-6 text-center">
          <div>
            <h2 className="font-display text-2xl font-bold">Entregue... virtualmente 🎉😋</h2>
            <p className="mt-2 text-sm text-foreground/70">
              Pedido #{pedidoAtual.id} &ldquo;chegou&rdquo;. A comida nunca vem — mas você ficou
              com a dopamina e cada centavo 💸
            </p>
          </div>

          <div className="rounded-xl bg-fundo p-3 text-left text-sm">
            <ul className="flex flex-col gap-1">
              {pedidoAtual.itens.map((item) => (
                <li key={item.itemId} className="flex justify-between">
                  <span>
                    {item.quantidade}x {item.nome}
                  </span>
                  <span>{formatarPreco(item.precoUnitario * item.quantidade)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-black/10 pt-2 font-bold">
              <span>Total</span>
              <span>{formatarPreco(pedidoAtual.total)}</span>
            </div>
            <p className="mt-1 text-xs text-foreground/50">
              {new Date(pedidoAtual.criadoEm).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>

          <p className="font-display text-sm font-bold text-destaque">
            Crise evitada. Carteira intacta. 🧠❤️
          </p>

          <div className="flex flex-col items-center gap-2">
            <div className="[perspective:800px]">
              <div
                className="relative h-48 w-36 transition-transform duration-700 [transform-style:preserve-3d]"
                style={{ transform: virada ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-primaria bg-primaria text-4xl text-white [backface-visibility:hidden]">
                  🏍️
                </div>
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl p-3 [backface-visibility:hidden] ${MOLDURA_POR_RARIDADE[pedidoAtual.motoboy.raridade]}`}
                  style={{ transform: "rotateY(180deg)" }}
                >
                  {pedidoAtual.motoboy.raridade !== "COMUM" && (
                    <span className="absolute -top-2 text-lg">✨</span>
                  )}
                  <span className="text-5xl">{pedidoAtual.motoboy.avatarEmoji}</span>
                  <span className="font-display text-sm font-bold">{pedidoAtual.motoboy.nome}</span>
                  <span className="text-xs text-foreground/60">
                    &ldquo;{pedidoAtual.motoboy.frase}&rdquo;
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-foreground/50">
                    {RARIDADE_ROTULO[pedidoAtual.motoboy.raridade]}
                  </span>
                </div>
              </div>
            </div>
            {virada && repetida && (
              <p className="text-sm font-semibold text-foreground/60">
                Repetida! Cola no álbum do bafo 😅
              </p>
            )}
          </div>

          <DoacaoCard colapsavel />

          <div>
            <h3 className="mb-2 text-left font-display text-base font-bold">
              🎒 Passaporte do Brasil · {regioesColetadas.size}/5
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {TODAS_REGIOES.map((regiao) => {
                const info = REGIOES_INFO.find((r) => r.valor === regiao)!;
                const coletada = regioesColetadas.has(regiao);
                return (
                  <div
                    key={regiao}
                    className={`flex flex-col items-center gap-1 rounded-xl p-2 text-center text-[10px] font-semibold ${
                      coletada
                        ? "bg-destaque/15 text-destaque"
                        : "bg-black/5 text-foreground/40"
                    }`}
                  >
                    <span className="text-lg">{info.emoji}</span>
                    {info.rotulo}
                  </div>
                );
              })}
            </div>
            {faltamRegioes > 0 ? (
              <p className="mt-2 text-xs text-foreground/60">
                Peça de mais {faltamRegioes} região{faltamRegioes === 1 ? "" : "ões"} pra
                completar!
              </p>
            ) : (
              <p className="mt-2 text-xs font-semibold text-destaque">
                Passaporte completo! 🇧🇷
              </p>
            )}
          </div>

          <p className="text-xs text-foreground/50">
            🃏 Álbum: {album.size}/{totalMotoboys} motoboys coletados
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={compartilharFigurinha}
              className="rounded-full border border-black/10 py-2.5 text-sm font-semibold transition hover:border-primaria"
            >
              📸 Compartilhar figurinha
            </button>
            <button
              onClick={fecharEntrega}
              className="rounded-full bg-primaria py-3 font-semibold text-white transition hover:opacity-90"
            >
              Pedir de novo 🍽️
            </button>
            <button
              onClick={fecharEntrega}
              className="rounded-full py-2 text-sm font-semibold text-foreground/60 hover:text-foreground"
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
