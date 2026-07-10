"use client";

import { useCarrinho } from "./CarrinhoProvider";
import {
  calcularSubtotal,
  calcularTaxaEntrega,
  calcularImpostos,
  calcularTotal,
  formatarPreco,
} from "@/lib/carrinho";

export default function CarrinhoDrawer() {
  const { itens, aberto, fecharCarrinho, removerItem, atualizarQuantidade } = useCarrinho();

  if (!aberto) return null;

  const subtotal = calcularSubtotal(itens);
  const entrega = calcularTaxaEntrega(subtotal);
  const impostos = calcularImpostos(subtotal);
  const total = calcularTotal(itens);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={fecharCarrinho}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col bg-fundo shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4">
          <h2 className="font-display text-lg font-bold">Sua marmita 🍱</h2>
          <button onClick={fecharCarrinho} aria-label="Fechar" className="text-xl">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {itens.length === 0 ? (
            <p className="mt-10 text-center text-foreground/60">
              Sua marmita tá vazia. Vai desejar alguma coisa! 😋
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {itens.map((item) => (
                <li key={item.itemId} className="flex gap-3 rounded-xl bg-white p-3 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.fotoUrl}
                    alt={item.nome}
                    className="h-16 w-16 rounded-lg object-cover text-transparent"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold">{item.nome}</span>
                      <button
                        onClick={() => removerItem(item.itemId)}
                        className="text-xs text-red-500"
                      >
                        remover
                      </button>
                    </div>
                    {item.opcoes.length > 0 && (
                      <p className="text-xs text-foreground/50">
                        {item.opcoes.map((o) => o.nome).join(" · ")}
                      </p>
                    )}
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => atualizarQuantidade(item.itemId, item.quantidade - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold">{item.quantidade}</span>
                        <button
                          onClick={() => atualizarQuantidade(item.itemId, item.quantidade + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-primaria">
                        {formatarPreco(item.precoUnitario * item.quantidade)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {itens.length > 0 && (
          <div className="border-t border-black/10 bg-white px-5 py-4">
            <div className="flex flex-col gap-1 text-sm text-foreground/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatarPreco(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Entrega (fake)</span>
                <span>{formatarPreco(entrega)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impostos (fake)</span>
                <span>{formatarPreco(impostos)}</span>
              </div>
              <div className="mt-1 flex justify-between text-base font-bold text-foreground">
                <span>Total</span>
                <span>{formatarPreco(total)}</span>
              </div>
            </div>
            <button className="mt-4 w-full rounded-full bg-primaria py-3 font-semibold text-white transition hover:opacity-90">
              Fechar pedido 🎉
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
