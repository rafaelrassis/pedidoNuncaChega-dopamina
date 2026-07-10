import type { MotoboyPublico, PedidoSalvo } from "./tipos";

export type EntradaAlbum = { motoboy: MotoboyPublico; quantidade: number };

export function calcularAlbum(pedidos: PedidoSalvo[]): Map<string, EntradaAlbum> {
  const mapa = new Map<string, EntradaAlbum>();
  for (const pedido of pedidos) {
    const existente = mapa.get(pedido.motoboy.id);
    if (existente) {
      existente.quantidade += 1;
    } else {
      mapa.set(pedido.motoboy.id, { motoboy: pedido.motoboy, quantidade: 1 });
    }
  }
  return mapa;
}
