"use client";

import { useState } from "react";
import { useCarrinho } from "./CarrinhoProvider";
import {
  calcularEconomia,
  calcularImpostos,
  calcularSubtotal,
  calcularTaxaEntrega,
  formatarPreco,
} from "@/lib/carrinho";
import { ENDERECOS_DISPONIVEIS } from "@/lib/tipos";
import FalsoQRCode from "./FalsoQRCode";

const CODIGO_PIX_FAKE =
  "00020126360014BR.GOV.BCB.PIX0114FAKE00000000520400005303986580" +
  "2BR5913PedidoNuncaChega6009SAOPAULO62070503***NUNCACHEGA6304FAKE";

type Etapa = "resumo" | "pagamento" | "processando" | "aprovado";

export default function CheckoutModal() {
  const { itens, checkoutAberto, fecharCheckout, enderecoIndice, criarPedido } = useCarrinho();
  const [etapa, setEtapa] = useState<Etapa>("resumo");
  const [copiado, setCopiado] = useState(false);

  if (!checkoutAberto) return null;

  const subtotal = calcularSubtotal(itens);
  const economia = calcularEconomia(itens);
  const entrega = calcularTaxaEntrega(subtotal);
  const impostos = calcularImpostos(subtotal);
  const total = subtotal + entrega + impostos;
  const endereco = ENDERECOS_DISPONIVEIS[enderecoIndice];

  function fechar() {
    setEtapa("resumo");
    fecharCheckout();
  }

  function pagar() {
    setEtapa("processando");
    setTimeout(() => {
      setEtapa("aprovado");
      setTimeout(() => {
        criarPedido();
        setEtapa("resumo");
      }, 1200);
    }, 2000);
  }

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(CODIGO_PIX_FAKE);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // ambiente sem permissão de clipboard: apenas ignora
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center"
      onClick={etapa === "processando" || etapa === "aprovado" ? undefined : fechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
      >
        {etapa === "resumo" && (
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Finalizar pedido</h2>
              <button onClick={fechar} aria-label="Fechar" className="text-xl">
                ×
              </button>
            </div>

            <div className="rounded-xl bg-fundo p-3 text-sm">
              <p className="font-semibold">
                ENTREGAR EM {endereco.emoji} {endereco.texto}
              </p>
              <p className="text-foreground/60">
                Entrega em 25–35 min · sem contato disponível
              </p>
            </div>

            <ul className="flex flex-col gap-1 text-sm">
              {itens.map((item) => (
                <li key={item.itemId} className="flex justify-between">
                  <span>
                    {item.quantidade}x {item.nome}
                  </span>
                  <span>{formatarPreco(item.precoUnitario * item.quantidade)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-1 border-t border-black/10 pt-3 text-sm text-foreground/70">
              <div className="flex justify-between">
                <span>Total dos itens</span>
                <span>{formatarPreco(subtotal + economia)}</span>
              </div>
              {economia > 0 && (
                <div className="flex justify-between text-destaque">
                  <span>Desconto</span>
                  <span>− {formatarPreco(economia)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Entrega (fake)</span>
                <span>{formatarPreco(entrega)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impostos (fake)</span>
                <span>{formatarPreco(impostos)}</span>
              </div>
              <div className="mt-1 flex justify-between text-base font-bold text-foreground">
                <span>A pagar</span>
                <span>{formatarPreco(total)}</span>
              </div>
            </div>

            {economia > 0 && (
              <div className="rounded-xl bg-destaque/10 p-3 text-center text-sm font-semibold text-destaque">
                🎉 Você economizou {formatarPreco(economia)} — e vai pagar R$ 0
              </div>
            )}

            <button
              onClick={() => setEtapa("pagamento")}
              className="rounded-full bg-primaria py-3 font-semibold text-white transition hover:opacity-90"
            >
              Ir para pagamento
            </button>
          </div>
        )}

        {etapa === "pagamento" && (
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">PIX de mentirinha</h2>
              <button onClick={fechar} aria-label="Fechar" className="text-xl">
                ×
              </button>
            </div>

            <FalsoQRCode />

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-foreground/60">PIX copia e cola</span>
              <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-fundo px-3 py-2">
                <code className="flex-1 truncate text-xs">{CODIGO_PIX_FAKE}</code>
                <button
                  onClick={copiarCodigo}
                  className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm"
                >
                  {copiado ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <button
                onClick={pagar}
                className="rounded-full bg-primaria py-3 font-semibold text-white transition hover:opacity-90"
              >
                Pagar com PIX imaginário · {formatarPreco(total)} 🎉
              </button>
              <p className="text-center text-xs text-foreground/50">
                a comida não vem — mas a dopamina sim 🧠
              </p>
            </div>
          </div>
        )}

        {etapa === "processando" && (
          <div className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primaria border-t-transparent" />
            <p className="font-semibold">Aguardando pagamento...</p>
          </div>
        )}

        {etapa === "aprovado" && (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="text-4xl">✅</span>
            <p className="font-display text-xl font-bold text-destaque">Aprovado! (mentira)</p>
          </div>
        )}
      </div>
    </div>
  );
}
