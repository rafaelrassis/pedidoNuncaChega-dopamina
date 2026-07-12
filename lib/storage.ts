/**
 * Toda a progressão do jogador (pedidos, álbum de figurinhas, passaporte,
 * streak) vive apenas no navegador. Nunca persistir isso no banco — o
 * Prisma/Postgres serve só para conteúdo estático do site (ex: catálogo de
 * motoboys), nunca para estado do jogador.
 */

import type { ItemCarrinho, MotoboyPublico, PedidoSalvo, Streak } from "./tipos";
import type { RepetidasConsumidas } from "./troca";

const CHAVES = {
  pedidos: "pnc:pedidos",
  streak: "pnc:streak",
  figurinhasBonus: "pnc:figurinhasBonus",
  carrinho: "pnc:carrinho",
  enderecoIndice: "pnc:enderecoIndice",
  contadorDesejos: "pnc:contadorDesejos",
  repetidasConsumidas: "pnc:repetidasConsumidas",
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

  getStreak: () => ler<Streak>(CHAVES.streak, { dias: 0, ultimaData: null }),
  setStreak: (streak: Streak) => escrever(CHAVES.streak, streak),

  getFigurinhasBonus: () => ler<MotoboyPublico[]>(CHAVES.figurinhasBonus, []),
  setFigurinhasBonus: (figurinhas: MotoboyPublico[]) =>
    escrever(CHAVES.figurinhasBonus, figurinhas),

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
  setContadorDesejos: (valor: number): void => escrever(CHAVES.contadorDesejos, valor),

  getRepetidasConsumidas: () =>
    ler<RepetidasConsumidas>(CHAVES.repetidasConsumidas, {}),
  setRepetidasConsumidas: (valor: RepetidasConsumidas) =>
    escrever(CHAVES.repetidasConsumidas, valor),
};
