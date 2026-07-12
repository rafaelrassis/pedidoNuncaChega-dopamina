import type { MotoboyPublico } from "./tipos";

export const MENSAGENS_PRESET = [
  "Cadê você? 👀",
  "Ainda demora muito?",
  "Posso confiar que já já chega?",
  "Falou, valeu!",
];

const RESPOSTAS_GENERICAS = [
  "Tô chegando, só mais um pouquinho! 🏍️",
  "Já virei a esquina, prometo!",
  "2 minutinhos e tô aí!",
  "Calma que já tô quase chegando 😅",
  "Só mais uma parada e já vou!",
];

export function sortearRespostaMotoboy(
  motoboy: MotoboyPublico,
  rng: () => number = Math.random
): string {
  const pool = [motoboy.frase, ...RESPOSTAS_GENERICAS];
  const indice = Math.min(Math.floor(rng() * pool.length), pool.length - 1);
  return pool[indice];
}
