"use client";

import Link from "next/link";
import { useCarrinho } from "./CarrinhoProvider";
import { calcularAlbum } from "@/lib/album";
import { calcularRegioesColetadas, TODAS_REGIOES } from "@/lib/passaporte";
import { REGIOES_INFO } from "@/lib/regioes";

const MOLDURA_POR_RARIDADE: Record<string, string> = {
  COMUM: "border-black/10 bg-white",
  RARO: "border-slate-300 bg-gradient-to-br from-slate-100 via-white to-slate-300",
  LENDARIO: "border-amber-400 bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300",
};

export default function AlbumConteudo() {
  const { motoboys, pedidos } = useCarrinho();
  const album = calcularAlbum(pedidos);
  const regioesColetadas = calcularRegioesColetadas(pedidos);
  const faltamRegioes = TODAS_REGIOES.length - regioesColetadas.size;
  const totalMotoboys = motoboys.length || 12;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-10">
      <div>
        <h1 className="font-display text-2xl font-bold">
          🃏 Seus Motoboys · {album.size}/{totalMotoboys}{" "}
          <span className="text-base font-normal text-foreground/50">(✨ = raro)</span>
        </h1>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {motoboys.map((m) => {
            const coletado = album.has(m.id);
            return (
              <div
                key={m.id}
                className={`flex flex-col items-center gap-1 rounded-2xl border p-4 text-center ${
                  coletado ? MOLDURA_POR_RARIDADE[m.raridade] : "border-black/5 bg-black/5"
                }`}
              >
                <span className="text-3xl">{coletado ? m.avatarEmoji : "❓"}</span>
                <span className="text-xs font-semibold">{coletado ? m.nome : "???"}</span>
                {coletado && m.raridade !== "COMUM" && <span className="text-xs">✨</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold">
          🎒 Passaporte · {regioesColetadas.size}/5
        </h2>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {TODAS_REGIOES.map((regiao) => {
            const info = REGIOES_INFO.find((r) => r.valor === regiao)!;
            const coletada = regioesColetadas.has(regiao);
            return (
              <div
                key={regiao}
                className={`flex flex-col items-center gap-1 rounded-xl p-3 text-center text-xs font-semibold ${
                  coletada ? "bg-destaque/15 text-destaque" : "bg-black/5 text-foreground/40"
                }`}
              >
                <span className="text-xl">{info.emoji}</span>
                {info.rotulo}
              </div>
            );
          })}
        </div>
        {faltamRegioes > 0 ? (
          <p className="mt-2 text-sm text-foreground/60">
            Peça de mais {faltamRegioes} região{faltamRegioes === 1 ? "" : "ões"} pra completar!
          </p>
        ) : (
          <p className="mt-2 text-sm font-semibold text-destaque">Passaporte completo! 🇧🇷</p>
        )}
      </div>

      <div className="rounded-xl bg-white p-4 text-sm shadow-sm">
        Você já fez <strong>{pedidos.length}</strong> pedido{pedidos.length === 1 ? "" : "s"}.
      </div>

      <Link href="/" className="self-start text-sm font-semibold text-primaria hover:underline">
        ← Voltar pro cardápio
      </Link>
    </main>
  );
}
