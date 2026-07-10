import type { MotoboyPublico, PedidoSalvo } from "./tipos";

export type EntradaAlbum = { motoboy: MotoboyPublico; quantidade: number };

export function calcularAlbum(
  pedidos: PedidoSalvo[],
  figurinhasBonus: MotoboyPublico[] = []
): Map<string, EntradaAlbum> {
  const mapa = new Map<string, EntradaAlbum>();

  function adicionar(motoboy: MotoboyPublico) {
    const existente = mapa.get(motoboy.id);
    if (existente) {
      existente.quantidade += 1;
    } else {
      mapa.set(motoboy.id, { motoboy, quantidade: 1 });
    }
  }

  for (const pedido of pedidos) adicionar(pedido.motoboy);
  for (const motoboy of figurinhasBonus) adicionar(motoboy);

  return mapa;
}
