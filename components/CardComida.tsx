import Link from "next/link";
import type { ComidaCliente } from "@/lib/tipos";
import { formatarPreco } from "@/lib/carrinho";

const ESTILO_SELO =
  "rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold shadow-sm";

export default function CardComida({
  comida,
  onAbrir,
}: {
  comida: ComidaCliente;
  onAbrir: (comida: ComidaCliente) => void;
}) {
  const precoComDesconto = comida.precoFake * (1 - comida.descontoPct / 100);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onAbrir(comida)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onAbrir(comida);
      }}
      className="flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={comida.fotoUrl}
          alt={comida.nome}
          className="h-full w-full object-cover text-transparent"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {comida.best && <span className={ESTILO_SELO}>⭐ MELHOR</span>}
          {comida.trending && <span className={ESTILO_SELO}>🔥</span>}
          {comida.vegetariano && <span className={ESTILO_SELO}>🌱</span>}
        </div>
        <Link
          href={`/receitas/${comida.slug}`}
          onClick={(e) => e.stopPropagation()}
          className={`${ESTILO_SELO} absolute right-2 top-2`}
        >
          📖 Receita
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-base font-bold">{comida.nome}</h3>
        <p className="text-xs text-foreground/60">
          ★ {comida.avaliacaoFake.toFixed(1)} ({comida.numAvaliacoesFake}) ·{" "}
          {comida.tempoPreparoMin} min
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {comida.descontoPct > 0 && (
            <span className="text-xs text-foreground/40 line-through">
              {formatarPreco(comida.precoFake)}
            </span>
          )}
          <span className="font-display font-bold text-primaria">
            {formatarPreco(precoComDesconto)}
          </span>
          {comida.descontoPct > 0 && (
            <span className="rounded bg-destaque/10 px-1.5 py-0.5 text-xs font-bold text-destaque">
              {comida.descontoPct}% OFF
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAbrir(comida);
          }}
          className="mt-2 self-start rounded-full bg-primaria px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
        >
          ADICIONAR
        </button>
      </div>
    </div>
  );
}
