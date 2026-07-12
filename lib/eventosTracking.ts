export type EventoAleatorio = {
  id: string;
  texto: string;
  deltaSegundos: number;
  chance: number;
};

export const TEMPO_MINIMO_SEGUNDOS = 15;

export const POOL_EVENTOS_ALEATORIOS: EventoAleatorio[] = [
  { id: "chuva", texto: "Pegou chuva, +40s de emoção 🌧️", deltaSegundos: 40, chance: 1 },
  { id: "agua-coco", texto: "Parou pra tomar uma água de coco 🥥", deltaSegundos: 0, chance: 1 },
  { id: "pneu-furado", texto: "Pneu furou, +30s de novela 🛞", deltaSegundos: 30, chance: 1 },
  { id: "final-jogo", texto: "Parou pra ver o final do jogo ⚽", deltaSegundos: 20, chance: 1 },
  { id: "atalho", texto: "Pegou um atalho secreto 🛣️", deltaSegundos: -20, chance: 1 },
  { id: "cachorro", texto: "Cachorro correu atrás da moto 🐕", deltaSegundos: 0, chance: 1 },
  { id: "sinal", texto: "Sinal fechado há 3 gerações 🚦", deltaSegundos: 15, chance: 1 },
];

export function sortearEventoAleatorio(rng: () => number = Math.random): EventoAleatorio {
  const pesoTotal = POOL_EVENTOS_ALEATORIOS.reduce((soma, e) => soma + e.chance, 0);
  let alvo = rng() * pesoTotal;
  for (const evento of POOL_EVENTOS_ALEATORIOS) {
    if (alvo < evento.chance) return evento;
    alvo -= evento.chance;
  }
  return POOL_EVENTOS_ALEATORIOS[POOL_EVENTOS_ALEATORIOS.length - 1];
}

export function aplicarEventoAoTempo(
  segundosRestantes: number,
  duracaoTotal: number,
  deltaSegundos: number
): { segundosRestantes: number; duracaoTotal: number } {
  const novoRestante = Math.max(TEMPO_MINIMO_SEGUNDOS, segundosRestantes + deltaSegundos);
  const deltaEfetivo = novoRestante - segundosRestantes;
  return {
    segundosRestantes: novoRestante,
    duracaoTotal: duracaoTotal + deltaEfetivo,
  };
}
