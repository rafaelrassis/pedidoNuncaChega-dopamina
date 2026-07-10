import type { Regiao } from "@prisma/client";

export const REGIOES_INFO: { valor: Regiao; rotulo: string; emoji: string }[] = [
  { valor: "NORDESTE", rotulo: "Nordeste", emoji: "🌵" },
  { valor: "NORTE", rotulo: "Norte", emoji: "🌳" },
  { valor: "SUDESTE", rotulo: "Sudeste", emoji: "🏙️" },
  { valor: "SUL", rotulo: "Sul", emoji: "🧉" },
  { valor: "CENTRO_OESTE", rotulo: "Centro-Oeste", emoji: "🌾" },
];
