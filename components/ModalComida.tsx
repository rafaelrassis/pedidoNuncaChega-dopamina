"use client";

import { useEffect, useState } from "react";
import type { ComidaCliente, OpcaoSelecionada } from "@/lib/tipos";
import { formatarPreco } from "@/lib/carrinho";
import { useCarrinho } from "./CarrinhoProvider";

export default function ModalComida({
  comida,
  onFechar,
}: {
  comida: ComidaCliente;
  onFechar: () => void;
}) {
  const { adicionarItem } = useCarrinho();
  const [selecoes, setSelecoes] = useState<Record<string, string>>({});
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    const iniciais: Record<string, string> = {};
    comida.opcoesJson.forEach((grupo) => {
      if (grupo.opcoes[0]) iniciais[grupo.grupo] = grupo.opcoes[0].nome;
    });
    setSelecoes(iniciais);
    setQuantidade(1);
  }, [comida]);

  const precoBase = comida.precoFake * (1 - comida.descontoPct / 100);
  const acrescimos = comida.opcoesJson.reduce((soma, grupo) => {
    const nomeSelecionado = selecoes[grupo.grupo];
    const opcao = grupo.opcoes.find((o) => o.nome === nomeSelecionado);
    return soma + (opcao?.acrescimo ?? 0);
  }, 0);
  const precoUnitario = precoBase + acrescimos;
  const precoOriginalUnitario = comida.precoFake + acrescimos;
  const precoTotal = precoUnitario * quantidade;

  function confirmar() {
    const opcoesSelecionadas: OpcaoSelecionada[] = comida.opcoesJson.map((grupo) => {
      const nomeSelecionado = selecoes[grupo.grupo];
      const opcao = grupo.opcoes.find((o) => o.nome === nomeSelecionado) ?? grupo.opcoes[0];
      return { grupo: grupo.grupo, nome: opcao.nome, acrescimo: opcao.acrescimo };
    });

    adicionarItem({
      comidaId: comida.id,
      nome: comida.nome,
      slug: comida.slug,
      fotoUrl: comida.fotoUrl,
      regiao: comida.regiao,
      precoUnitario,
      precoOriginalUnitario,
      quantidade,
      opcoes: opcoesSelecionadas,
    });
    onFechar();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onFechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
      >
        <div className="relative aspect-[16/9] w-full bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={comida.fotoUrl}
            alt={comida.nome}
            className="h-full w-full object-cover text-transparent"
          />
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-4 p-6">
          <div>
            <h2 className="font-display text-xl font-bold">{comida.nome}</h2>
            <p className="mt-1 text-sm text-foreground/70">{comida.descricao}</p>
          </div>

          {comida.opcoesJson.map((grupo) => (
            <div key={grupo.grupo}>
              <h3 className="mb-2 text-sm font-semibold">{grupo.grupo}</h3>
              <div className="flex flex-col gap-2">
                {grupo.opcoes.map((opcao) => (
                  <label
                    key={opcao.nome}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-black/10 px-3 py-2 text-sm has-[:checked]:border-primaria"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={grupo.grupo}
                        checked={selecoes[grupo.grupo] === opcao.nome}
                        onChange={() =>
                          setSelecoes((atual) => ({ ...atual, [grupo.grupo]: opcao.nome }))
                        }
                      />
                      {opcao.nome}
                    </span>
                    {opcao.acrescimo > 0 && (
                      <span className="text-foreground/60">
                        + {formatarPreco(opcao.acrescimo)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Quantidade</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-lg"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{quantidade}</span>
              <button
                onClick={() => setQuantidade((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-lg"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={confirmar}
            className="rounded-full bg-primaria py-3 font-semibold text-white transition hover:opacity-90"
          >
            Adicionar {quantidade} · {formatarPreco(precoTotal)}
          </button>
        </div>
      </div>
    </div>
  );
}
