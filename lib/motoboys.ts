import type { MotoboyPublico } from "./tipos";

export function sortearMotoboy(motoboys: MotoboyPublico[]): MotoboyPublico {
  const pesoTotal = motoboys.reduce((soma, m) => soma + m.pesoSorteio, 0);
  let alvo = Math.random() * pesoTotal;
  for (const motoboy of motoboys) {
    if (alvo < motoboy.pesoSorteio) return motoboy;
    alvo -= motoboy.pesoSorteio;
  }
  return motoboys[motoboys.length - 1];
}
