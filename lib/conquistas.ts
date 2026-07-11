import type { Regiao } from "@prisma/client";
import type { EntradaAlbum } from "./album";
import type { PedidoSalvo, Streak } from "./tipos";

export type Conquista = {
  id: string;
  emoji: string;
  nome: string;
  descricao: string;
  desbloqueada: boolean;
};

type DefinicaoConquista = {
  id: string;
  emoji: string;
  nome: string;
  descricao: string;
  condicao: (ctx: ContextoConquistas) => boolean;
};

type ContextoConquistas = {
  pedidos: PedidoSalvo[];
  album: Map<string, EntradaAlbum>;
  totalMotoboys: number;
  regioesColetadas: Set<Regiao>;
  streak: Streak;
};

function contarPedidosPorComida(pedidos: PedidoSalvo[]): Map<string, number> {
  const contagem = new Map<string, number>();
  for (const pedido of pedidos) {
    const comidasNoPedido = new Set(pedido.itens.map((item) => item.comidaId));
    for (const comidaId of comidasNoPedido) {
      contagem.set(comidaId, (contagem.get(comidaId) ?? 0) + 1);
    }
  }
  return contagem;
}

const DEFINICOES: DefinicaoConquista[] = [
  {
    id: "primeiro-pedido",
    emoji: "🍽️",
    nome: "Primeiro pedido",
    descricao: "Fez seu primeiro pedido que nunca chegou.",
    condicao: ({ pedidos }) => pedidos.length >= 1,
  },
  {
    id: "cliente-fiel",
    emoji: "🔁",
    nome: "Cliente fiel",
    descricao: "Já são 10 pedidos que nunca chegaram.",
    condicao: ({ pedidos }) => pedidos.length >= 10,
  },
  {
    id: "viciado",
    emoji: "💀",
    nome: "Viciado",
    descricao: "50 pedidos. Talvez seja hora de repensar a vida.",
    condicao: ({ pedidos }) => pedidos.length >= 50,
  },
  {
    id: "coruja",
    emoji: "🦉",
    nome: "Coruja",
    descricao: "Fez um pedido entre meia-noite e 5h da manhã.",
    condicao: ({ pedidos }) =>
      pedidos.some((p) => {
        const hora = new Date(p.criadoEm).getHours();
        return hora >= 0 && hora < 5;
      }),
  },
  {
    id: "sempre-o-mesmo",
    emoji: "🔂",
    nome: "Sempre o mesmo",
    descricao: "Pediu o mesmo prato em 3 pedidos diferentes.",
    condicao: ({ pedidos }) =>
      [...contarPedidosPorComida(pedidos).values()].some((quantidade) => quantidade >= 3),
  },
  {
    id: "colecionador",
    emoji: "🃏",
    nome: "Colecionador",
    descricao: "Completou o álbum de motoboys.",
    condicao: ({ album, totalMotoboys }) => totalMotoboys > 0 && album.size >= totalMotoboys,
  },
  {
    id: "mochileiro",
    emoji: "🎒",
    nome: "Mochileiro",
    descricao: "Carimbou o passaporte nas 5 regiões do Brasil.",
    condicao: ({ regioesColetadas }) => regioesColetadas.size >= 5,
  },
  {
    id: "em-chamas",
    emoji: "🔥",
    nome: "Em chamas",
    descricao: "7 dias seguidos pedindo.",
    condicao: ({ streak }) => streak.dias >= 7,
  },
  {
    id: "sortudo",
    emoji: "✨",
    nome: "Sortudo",
    descricao: "Tirou um motoboy lendário.",
    condicao: ({ album }) =>
      [...album.values()].some((entrada) => entrada.motoboy.raridade === "LENDARIO"),
  },
];

export function calcularConquistas(
  pedidos: PedidoSalvo[],
  album: Map<string, EntradaAlbum>,
  totalMotoboys: number,
  regioesColetadas: Set<Regiao>,
  streak: Streak
): Conquista[] {
  const ctx: ContextoConquistas = { pedidos, album, totalMotoboys, regioesColetadas, streak };
  return DEFINICOES.map((def) => ({
    id: def.id,
    emoji: def.emoji,
    nome: def.nome,
    descricao: def.descricao,
    desbloqueada: def.condicao(ctx),
  }));
}
