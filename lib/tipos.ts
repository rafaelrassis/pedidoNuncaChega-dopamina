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
  regiao: Regiao;
  precoUnitario: number;
  precoOriginalUnitario: number;
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

export type Raridade = "COMUM" | "RARO" | "LENDARIO";

export type MotoboyPublico = {
  id: string;
  nome: string;
  avatarEmoji: string;
  frase: string;
  raridade: Raridade;
  pesoSorteio: number;
};

export type Streak = {
  dias: number;
  ultimaData: string | null;
};

export type StatusPedido = "a_caminho" | "entregue";

export type PedidoSalvo = {
  id: string;
  itens: ItemCarrinho[];
  subtotal: number;
  economia: number;
  entrega: number;
  impostos: number;
  total: number;
  criadoEm: string;
  motoboy: MotoboyPublico;
  status: StatusPedido;
};
