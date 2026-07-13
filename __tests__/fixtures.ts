import type { ItemCarrinho, MotoboyPublico, OpcaoSelecionada, PedidoSalvo } from "@/lib/tipos";

export function criarMotoboy(overrides: Partial<MotoboyPublico> = {}): MotoboyPublico {
  return {
    id: "motoboy-1",
    nome: "Jailson da Biz",
    avatarEmoji: "🏍️",
    fotoUrl: null,
    frase: "Tô chegando, confia",
    raridade: "COMUM",
    pesoSorteio: 10,
    ...overrides,
  };
}

export function criarItemCarrinho(overrides: Partial<ItemCarrinho> = {}): ItemCarrinho {
  const opcoes: OpcaoSelecionada[] = overrides.opcoes ?? [];
  return {
    itemId: "item-1",
    comidaId: "comida-1",
    nome: "Feijoada",
    slug: "feijoada",
    fotoUrl: "/img/feijoada.jpg",
    regiao: "SUDESTE",
    precoUnitario: 30,
    precoOriginalUnitario: 40,
    quantidade: 1,
    ...overrides,
    opcoes,
  };
}

export function criarPedido(overrides: Partial<PedidoSalvo> = {}): PedidoSalvo {
  return {
    id: "PNC1234",
    itens: [criarItemCarrinho()],
    subtotal: 30,
    economia: 10,
    entrega: 9,
    impostos: 1.5,
    total: 40.5,
    criadoEm: "2026-07-10T12:00:00.000Z",
    motoboy: criarMotoboy(),
    status: "a_caminho",
    ...overrides,
  };
}
