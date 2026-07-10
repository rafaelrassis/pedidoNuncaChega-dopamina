"use client";

import Link from "next/link";
import { useCarrinho } from "./CarrinhoProvider";
import { calcularAlbum } from "@/lib/album";
import { calcularRegioesColetadas } from "@/lib/passaporte";
import { formatarPreco } from "@/lib/carrinho";

export default function SecoesPersistentesCarrinho() {
  const { pedidos, motoboys } = useCarrinho();
  const album = calcularAlbum(pedidos);
  const regioesColetadas = calcularRegioesColetadas(pedidos);
  const pedidosRecentes = [...pedidos].reverse().slice(0, 5);

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-black/10 pt-4 text-sm">
      <div>
        <h3 className="mb-2 font-semibold">📜 Pedidos anteriores</h3>
        {pedidosRecentes.length === 0 ? (
          <p className="text-xs text-foreground/50">Nenhum pedido ainda.</p>
        ) : (
          <ul className="flex flex-col gap-1 text-xs text-foreground/70">
            {pedidosRecentes.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>
                  {new Date(p.criadoEm).toLocaleDateString("pt-BR")} · #{p.id}
                </span>
                <span>{formatarPreco(p.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/album"
        className="flex items-center justify-between rounded-xl bg-fundo px-3 py-2 transition hover:bg-black/5"
      >
        <span>🎒 Passaporte</span>
        <span className="font-semibold">{regioesColetadas.size}/5</span>
      </Link>

      <Link
        href="/album"
        className="flex items-center justify-between rounded-xl bg-fundo px-3 py-2 transition hover:bg-black/5"
      >
        <span>🃏 Motoboys</span>
        <span className="font-semibold">{album.size}/{motoboys.length || 12}</span>
      </Link>
    </div>
  );
}
