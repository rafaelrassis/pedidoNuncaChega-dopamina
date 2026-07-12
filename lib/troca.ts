import type { MotoboyPublico } from "./tipos";
import type { EntradaAlbum } from "./album";

export const REPETIDAS_POR_TROCA = 5;

export type RepetidasConsumidas = Record<string, number>;

export function contarRepetidasDisponiveis(
  album: Map<string, EntradaAlbum>,
  repetidasConsumidas: RepetidasConsumidas
): number {
  let total = 0;
  for (const [id, entrada] of album) {
    const consumidas = repetidasConsumidas[id] ?? 0;
    total += Math.max(0, entrada.quantidade - 1 - consumidas);
  }
  return total;
}

export function podeTrocar(
  album: Map<string, EntradaAlbum>,
  repetidasConsumidas: RepetidasConsumidas
): boolean {
  return contarRepetidasDisponiveis(album, repetidasConsumidas) >= REPETIDAS_POR_TROCA;
}

export function consumirRepetidas(
  album: Map<string, EntradaAlbum>,
  repetidasConsumidas: RepetidasConsumidas,
  quantidade: number = REPETIDAS_POR_TROCA
): RepetidasConsumidas {
  const novo = { ...repetidasConsumidas };
  let restante = quantidade;
  for (const [id, entrada] of album) {
    if (restante <= 0) break;
    const consumidas = novo[id] ?? 0;
    const disponivel = entrada.quantidade - 1 - consumidas;
    if (disponivel <= 0) continue;
    const usar = Math.min(disponivel, restante);
    novo[id] = consumidas + usar;
    restante -= usar;
  }
  return novo;
}

export function sortearTroca(
  motoboys: MotoboyPublico[],
  rng: () => number = Math.random
): MotoboyPublico | null {
  const elegiveis = motoboys.filter((m) => m.raridade === "RARO" || m.raridade === "LENDARIO");
  if (elegiveis.length === 0) return null;

  const pesoTotal = elegiveis.reduce((soma, m) => soma + m.pesoSorteio, 0);
  let alvo = rng() * pesoTotal;
  for (const motoboy of elegiveis) {
    if (alvo < motoboy.pesoSorteio) return motoboy;
    alvo -= motoboy.pesoSorteio;
  }
  return elegiveis[elegiveis.length - 1];
}
