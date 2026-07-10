/**
 * Toda a progressão do jogador (pedidos, álbum de figurinhas, passaporte,
 * streak) vive apenas no navegador. Nunca persistir isso no banco — o
 * Prisma/Postgres serve só para conteúdo estático do site (ex: catálogo de
 * motoboys), nunca para estado do jogador.
 */

export type Pedido = {
  id: string;
  item: string;
  criadoEm: string;
  status: "a_caminho" | "atrasado" | "cancelado";
};

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
  getPedidos: () => ler<Pedido[]>(CHAVES.pedidos, []),
  setPedidos: (pedidos: Pedido[]) => escrever(CHAVES.pedidos, pedidos),

  getAlbum: () => ler<string[]>(CHAVES.album, []),
  setAlbum: (figurinhas: string[]) => escrever(CHAVES.album, figurinhas),

  getPassaporte: () => ler<Passaporte>(CHAVES.passaporte, { carimbos: [] }),
  setPassaporte: (passaporte: Passaporte) =>
    escrever(CHAVES.passaporte, passaporte),

  getStreak: () => ler<Streak>(CHAVES.streak, { dias: 0, ultimaData: null }),
  setStreak: (streak: Streak) => escrever(CHAVES.streak, streak),
};
