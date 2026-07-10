"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Tier = { valor: number; rotulo: string };

type ValorConfig = {
  chavePix: string;
  nomeRecebedor: string;
  cidadeRecebedor: string;
  tiersDoacaoJson: Tier[];
  textosJson: Record<string, string>;
};

export default function ConfigForm({ inicial }: { inicial: ValorConfig }) {
  const router = useRouter();
  const [valor, setValor] = useState<ValorConfig>(inicial);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  function campo<K extends keyof ValorConfig>(chave: K, novo: ValorConfig[K]) {
    setValor((atual) => ({ ...atual, [chave]: novo }));
  }

  function atualizarTier(indice: number, campos: Partial<Tier>) {
    campo(
      "tiersDoacaoJson",
      valor.tiersDoacaoJson.map((t, i) => (i === indice ? { ...t, ...campos } : t))
    );
  }

  function removerTier(indice: number) {
    campo(
      "tiersDoacaoJson",
      valor.tiersDoacaoJson.filter((_, i) => i !== indice)
    );
  }

  function adicionarTier() {
    campo("tiersDoacaoJson", [...valor.tiersDoacaoJson, { valor: 5, rotulo: "" }]);
  }

  const textosEntradas = Object.entries(valor.textosJson);

  function atualizarTexto(indice: number, chave: string, texto: string) {
    const novasEntradas = [...textosEntradas];
    novasEntradas[indice] = [chave, texto];
    campo("textosJson", Object.fromEntries(novasEntradas));
  }

  function removerTexto(indice: number) {
    const novasEntradas = textosEntradas.filter((_, i) => i !== indice);
    campo("textosJson", Object.fromEntries(novasEntradas));
  }

  function adicionarTexto() {
    campo("textosJson", { ...valor.textosJson, [`texto_${textosEntradas.length + 1}`]: "" });
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setSucesso(false);
    setSalvando(true);

    const resposta = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valor),
    });

    setSalvando(false);

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(typeof dados.erro === "string" ? dados.erro : "Erro ao salvar configuração");
      return;
    }

    setSucesso(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Chave PIX
          <input
            required
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
            value={valor.chavePix}
            onChange={(e) => campo("chavePix", e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Nome do recebedor
          <input
            required
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
            value={valor.nomeRecebedor}
            onChange={(e) => campo("nomeRecebedor", e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Cidade do recebedor
          <input
            required
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
            value={valor.cidadeRecebedor}
            onChange={(e) => campo("cidadeRecebedor", e.target.value)}
          />
        </label>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-lg font-bold">Tiers de doação</h2>
        <div className="flex flex-col gap-2">
          {valor.tiersDoacaoJson.map((tier, indice) => (
            <div key={indice} className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-24 rounded-lg border border-black/10 px-3 py-1.5 text-sm outline-none focus:border-primaria"
                value={tier.valor}
                onChange={(e) => atualizarTier(indice, { valor: Number(e.target.value) })}
              />
              <input
                className="flex-1 rounded-lg border border-black/10 px-3 py-1.5 text-sm outline-none focus:border-primaria"
                placeholder="Rótulo"
                value={tier.rotulo}
                onChange={(e) => atualizarTier(indice, { rotulo: e.target.value })}
              />
              <button
                type="button"
                onClick={() => removerTier(indice)}
                className="text-sm text-red-600"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={adicionarTier}
            className="self-start text-sm text-destaque hover:underline"
          >
            + Tier
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-lg font-bold">Textos gerais</h2>
        <div className="flex flex-col gap-2">
          {textosEntradas.map(([chave, texto], indice) => (
            <div key={indice} className="flex items-center gap-2">
              <input
                className="w-48 rounded-lg border border-black/10 px-3 py-1.5 text-sm outline-none focus:border-primaria"
                value={chave}
                onChange={(e) => atualizarTexto(indice, e.target.value, texto)}
              />
              <input
                className="flex-1 rounded-lg border border-black/10 px-3 py-1.5 text-sm outline-none focus:border-primaria"
                value={texto}
                onChange={(e) => atualizarTexto(indice, chave, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removerTexto(indice)}
                className="text-sm text-red-600"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={adicionarTexto}
            className="self-start text-sm text-destaque hover:underline"
          >
            + Texto
          </button>
        </div>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}
      {sucesso && <p className="text-sm text-destaque">Configuração salva.</p>}

      <button
        type="submit"
        disabled={salvando}
        className="self-start rounded-full bg-primaria px-6 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {salvando ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
