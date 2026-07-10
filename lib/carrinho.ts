import type { ItemCarrinho, OpcaoSelecionada } from "./tipos";

export const TAXA_ENTREGA_PCT = 0.3;
export const TAXA_IMPOSTOS_PCT = 0.05;

export function calcularSubtotal(itens: ItemCarrinho[]): number {
  return itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0);
}

export function calcularTaxaEntrega(subtotal: number): number {
  return subtotal * TAXA_ENTREGA_PCT;
}

export function calcularImpostos(subtotal: number): number {
  return subtotal * TAXA_IMPOSTOS_PCT;
}

export function calcularTotal(itens: ItemCarrinho[]): number {
  const subtotal = calcularSubtotal(itens);
  return subtotal + calcularTaxaEntrega(subtotal) + calcularImpostos(subtotal);
}

export function contarItens(itens: ItemCarrinho[]): number {
  return itens.reduce((soma, item) => soma + item.quantidade, 0);
}

export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function gerarChaveOpcoes(opcoes: OpcaoSelecionada[]): string {
  return opcoes
    .map((o) => `${o.grupo}:${o.nome}`)
    .sort()
    .join("|");
}
