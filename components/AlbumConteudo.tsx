"use client";

import Link from "next/link";
import { useCarrinho } from "./CarrinhoProvider";
import { calcularAlbum } from "@/lib/album";
import { calcularRegioesColetadas, TODAS_REGIOES } from "@/lib/passaporte";
import { REGIOES_INFO } from "@/lib/regioes";
import { calcularConquistas } from "@/lib/conquistas";
import { REPETIDAS_POR_TROCA } from "@/lib/troca";
import BackupProgresso from "./BackupProgresso";
import ModalTroca from "./ModalTroca";

const MOLDURA_POR_RARIDADE: Record<string, string> = {
  COMUM: "border-black/10 bg-white",
  RARO: "border-slate-300 bg-gradient-to-br from-slate-100 via-white to-slate-300",
  LENDARIO: "border-amber-400 bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300",
};

export default function AlbumConteudo() {
  const {
    motoboys,
    comidasCatalogo,
    pedidos,
    figurinhasBonus,
    streak,
    repetidasDisponiveis,
    trocarRepetidas,
  } = useCarrinho();
  const album = calcularAlbum(pedidos, figurinhasBonus);
  const regioesColetadas = calcularRegioesColetadas(pedidos);
  const faltamRegioes = TODAS_REGIOES.length - regioesColetadas.size;
  const totalMotoboys = motoboys.length || 12;
  const conquistas = calcularConquistas(
    pedidos,
    album,
    motoboys.length,
    regioesColetadas,
    streak,
    comidasCatalogo
  );
  const totalDesbloqueadas = conquistas.filter((c) => c.desbloqueada).length;

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
                {coletado && m.fotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.fotoUrl}
                    alt={m.nome}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">{coletado ? m.avatarEmoji : "❓"}</span>
                )}
                <span className="text-xs font-semibold">{coletado ? m.nome : "???"}</span>
                {coletado && m.raridade !== "COMUM" && <span className="text-xs">✨</span>}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-col items-start gap-2 rounded-xl bg-white p-4 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            🔄 Repetidas disponíveis: <strong>{repetidasDisponiveis}</strong>/{REPETIDAS_POR_TROCA}
          </p>
          <button
            onClick={trocarRepetidas}
            disabled={repetidasDisponiveis < REPETIDAS_POR_TROCA}
            className="rounded-full bg-destaque px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-foreground/40"
          >
            🔄 Trocar {REPETIDAS_POR_TROCA} repetidas
          </button>
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

      <div>
        <h2 className="font-display text-xl font-bold">
          🏅 Conquistas · {totalDesbloqueadas}/{conquistas.length}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {conquistas.map((c) => (
            <div
              key={c.id}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-4 text-center ${
                c.desbloqueada
                  ? "border-destaque/30 bg-destaque/10"
                  : "border-black/5 bg-black/5"
              }`}
            >
              <span className="text-3xl">{c.desbloqueada ? c.emoji : "❓"}</span>
              <span className="text-xs font-semibold">{c.desbloqueada ? c.nome : "???"}</span>
              {c.desbloqueada && (
                <span className="text-[10px] text-foreground/50">{c.descricao}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 rounded-xl bg-white p-4 text-sm shadow-sm">
        <p>
          Você já fez <strong>{pedidos.length}</strong> pedido{pedidos.length === 1 ? "" : "s"}.
        </p>
        {streak.dias > 0 && (
          <p>
            🔥 Ofensiva atual: <strong>{streak.dias}</strong>{" "}
            {streak.dias === 1 ? "dia" : "dias"} seguidos.
          </p>
        )}
      </div>

      <BackupProgresso />

      <Link href="/" className="self-start text-sm font-semibold text-primaria hover:underline">
        ← Voltar pro cardápio
      </Link>

      <ModalTroca />
    </main>
  );
}
