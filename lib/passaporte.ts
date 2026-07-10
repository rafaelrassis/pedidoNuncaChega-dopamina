import type { Regiao } from "@prisma/client";
import type { PedidoSalvo } from "./tipos";

export const TODAS_REGIOES: Regiao[] = ["NORDESTE", "NORTE", "SUDESTE", "SUL", "CENTRO_OESTE"];

export function calcularRegioesColetadas(pedidos: PedidoSalvo[]): Set<Regiao> {
  const regioes = new Set<Regiao>();
  for (const pedido of pedidos) {
    for (const item of pedido.itens) {
      regioes.add(item.regiao);
    }
  }
  return regioes;
}
