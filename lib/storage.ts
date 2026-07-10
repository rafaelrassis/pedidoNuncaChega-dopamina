/**
 * Toda a progressão do jogador (pedidos, álbum de figurinhas, passaporte,
 * streak) vive apenas no navegador. Nunca persistir isso no banco — o
 * Prisma/Postgres serve só para conteúdo estático do site (ex: catálogo de
 * motoboys), nunca para estado do jogador.
 */

import type { ItemCarrinho, PedidoSalvo } from "./tipos";

export type Passaporte = {
  carimbos: string[];
};

export type Streak = {
  dias: number;
  ultimaData: string | null;
};

const CHAVES = {
  pedidos: "pnc:pedidos",
  album: "pnc:album",
  passaporte: "pnc:passaporte",
  streak: "pnc:streak",
  carrinho: "pnc:carrinho",
  enderecoIndice: "pnc:enderecoIndice",
  contadorDesejos: "pnc:contadorDesejos",
} as const;

function ler<T>(chave: string, valorPadrao: T): T {
  if (typeof window === "undefined") return valorPadrao;
  try {
    const bruto = window.localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : valorPadrao;
  } catch {
    return valorPadrao;
  }
}

function escrever<T>(chave: string, valor: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(chave, JSON.stringify(valor));
}

export const storage = {
  getPedidos: () => ler<PedidoSalvo[]>(CHAVES.pedidos, []),
  setPedidos: (pedidos: PedidoSalvo[]) => escrever(CHAVES.pedidos, pedidos),

  getAlbum: () => ler<string[]>(CHAVES.album, []),
  setAlbum: (figurinhas: string[]) => escrever(CHAVES.album, figurinhas),

  getPassaporte: () => ler<Passaporte>(CHAVES.passaporte, { carimbos: [] }),
  setPassaporte: (passaporte: Passaporte) =>
    escrever(CHAVES.passaporte, passaporte),

  getStreak: () => ler<Streak>(CHAVES.streak, { dias: 0, ultimaData: null }),
  setStreak: (streak: Streak) => escrever(CHAVES.streak, streak),

  getCarrinho: () => ler<ItemCarrinho[]>(CHAVES.carrinho, []),
  setCarrinho: (itens: ItemCarrinho[]) => escrever(CHAVES.carrinho, itens),

  getEnderecoIndice: () => ler<number>(CHAVES.enderecoIndice, 0),
  setEnderecoIndice: (indice: number) => escrever(CHAVES.enderecoIndice, indice),

  getContadorDesejos: (): number => {
    if (typeof window === "undefined") return 50000;
    const bruto = window.localStorage.getItem(CHAVES.contadorDesejos);
    if (bruto) return Number(bruto);
    const inicial = Math.floor(40000 + Math.random() * 20000);
    window.localStorage.setItem(CHAVES.contadorDesejos, String(inicial));
    return inicial;
  },
  incrementarContadorDesejos: (): number => {
    const atual = storage.getContadorDesejos();
    const novo = atual + 1;
    escrever(CHAVES.contadorDesejos, novo);
    return novo;
  },
};
