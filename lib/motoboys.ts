import type { MotoboyPublico } from "./tipos";

export const MOTOBOY_PADRAO: MotoboyPublico = {
  id: "fallback",
  nome: "Motoboy Misterioso",
  avatarEmoji: "🏍️",
  frase: "Sumiu no mapa, mas tá vindo",
  raridade: "COMUM",
  pesoSorteio: 1,
};

export function sortearMotoboy(motoboys: MotoboyPublico[]): MotoboyPublico {
  if (motoboys.length === 0) return MOTOBOY_PADRAO;

  const pesoTotal = motoboys.reduce((soma, m) => soma + m.pesoSorteio, 0);
  let alvo = Math.random() * pesoTotal;
  for (const motoboy of motoboys) {
    if (alvo < motoboy.pesoSorteio) return motoboy;
    alvo -= motoboy.pesoSorteio;
  }
  return motoboys[motoboys.length - 1];
}
