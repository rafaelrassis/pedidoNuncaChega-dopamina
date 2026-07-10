import type { Regiao } from "@prisma/client";

export type OpcaoItem = { nome: string; acrescimo: number };

export type GrupoOpcoes = {
  grupo: string;
  tipo: "radio" | "checkbox";
  opcoes: OpcaoItem[];
};

export type OpcaoSelecionada = { grupo: string; nome: string; acrescimo: number };

export type ItemCarrinho = {
  itemId: string;
  comidaId: string;
  nome: string;
  slug: string;
  fotoUrl: string;
  precoUnitario: number;
  quantidade: number;
  opcoes: OpcaoSelecionada[];
};

export type ComidaCliente = {
  id: string;
  nome: string;
  slug: string;
  regiao: Regiao;
  descricao: string;
  precoFake: number;
  descontoPct: number;
  avaliacaoFake: number;
  numAvaliacoesFake: number;
  tempoPreparoMin: number;
  fotoUrl: string;
  vegetariano: boolean;
  trending: boolean;
  best: boolean;
  opcoesJson: GrupoOpcoes[];
};

export type Endereco = { emoji: string; texto: string; tempoMin: number };

export const ENDERECOS_DISPONIVEIS: Endereco[] = [
  { emoji: "🏠", texto: "Rua da Fome, 404", tempoMin: 12 },
  { emoji: "🛋️", texto: "Sofá da Sala, s/n", tempoMin: 8 },
  { emoji: "🛏️", texto: "Cama, Embaixo do Edredom", tempoMin: 3 },
];
