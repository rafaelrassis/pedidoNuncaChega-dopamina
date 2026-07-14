"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import EditorOpcoes, { type GrupoOpcoes } from "./EditorOpcoes";
import UploadImagem from "./UploadImagem";

const REGIOES = ["NORDESTE", "NORTE", "SUDESTE", "SUL", "CENTRO_OESTE"] as const;

const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
] as const;

type ValorComida = {
  nome: string;
  slug: string;
  regiao: (typeof REGIOES)[number];
  estado: (typeof ESTADOS)[number];
  descricao: string;
  precoFake: number;
  descontoPct: number;
  avaliacaoFake: number;
  numAvaliacoesFake: number;
  tempoPreparoMin: number;
  fotoUrl: string;
  vegetariano: boolean;
  trending: boolean;
  best: boolean;
  opcoesJson: GrupoOpcoes[];
  receitaMd: string;
  ativo: boolean;
};

const VALOR_PADRAO: ValorComida = {
  nome: "",
  slug: "",
  regiao: "SUDESTE",
  estado: "SP",
  descricao: "",
  precoFake: 20,
  descontoPct: 0,
  avaliacaoFake: 4.7,
  numAvaliacoesFake: 1200,
  tempoPreparoMin: 25,
  fotoUrl: "",
  vegetariano: false,
  trending: false,
  best: false,
  opcoesJson: [],
  receitaMd: "",
  ativo: true,
};

export default function ComidaForm({
  inicial,
}: {
  inicial?: Partial<ValorComida> & { id: string };
}) {
  const router = useRouter();
  const [valor, setValor] = useState<ValorComida>({ ...VALOR_PADRAO, ...inicial });
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  function campo<K extends keyof ValorComida>(chave: K, novo: ValorComida[K]) {
    setValor((atual) => ({ ...atual, [chave]: novo }));
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setSalvando(true);

    const url = inicial?.id ? `/api/admin/comidas/${inicial.id}` : "/api/admin/comidas";
    const metodo = inicial?.id ? "PUT" : "POST";

    const resposta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valor),
    });

    setSalvando(false);

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(typeof dados.erro === "string" ? dados.erro : "Erro ao salvar comida");
      return;
    }

    router.push("/admin/comidas");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
        <Campo label="Nome">
          <input
            required
            className="input"
            value={valor.nome}
            onChange={(e) => campo("nome", e.target.value)}
          />
        </Campo>
        <Campo label="Slug">
          <input
            required
            className="input"
            value={valor.slug}
            onChange={(e) => campo("slug", e.target.value)}
            placeholder="ex: feijoada"
          />
        </Campo>
        <Campo label="Região">
          <select
            className="input"
            value={valor.regiao}
            onChange={(e) => campo("regiao", e.target.value as ValorComida["regiao"])}
          >
            {REGIOES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Estado">
          <select
            className="input"
            value={valor.estado}
            onChange={(e) => campo("estado", e.target.value as ValorComida["estado"])}
          >
            {ESTADOS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Foto">
          <UploadImagem
            value={valor.fotoUrl}
            onChange={(url) => campo("fotoUrl", url)}
            pasta="comidas"
          />
        </Campo>
        <Campo label="Preço fake (R$)">
          <input
            required
            type="number"
            step="0.01"
            min="0"
            className="input"
            value={valor.precoFake}
            onChange={(e) => campo("precoFake", Number(e.target.value))}
          />
        </Campo>
        <Campo label="Desconto (%)">
          <input
            type="number"
            min="0"
            max="100"
            className="input"
            value={valor.descontoPct}
            onChange={(e) => campo("descontoPct", Number(e.target.value))}
          />
        </Campo>
        <Campo label="Avaliação fake (0–5)">
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            className="input"
            value={valor.avaliacaoFake}
            onChange={(e) => campo("avaliacaoFake", Number(e.target.value))}
          />
        </Campo>
        <Campo label="Número de avaliações fake">
          <input
            type="number"
            min="0"
            className="input"
            value={valor.numAvaliacoesFake}
            onChange={(e) => campo("numAvaliacoesFake", Number(e.target.value))}
          />
        </Campo>
        <Campo label="Tempo de preparo (min)">
          <input
            type="number"
            min="1"
            className="input"
            value={valor.tempoPreparoMin}
            onChange={(e) => campo("tempoPreparoMin", Number(e.target.value))}
          />
        </Campo>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <Checkbox
            label="Vegetariano"
            checked={valor.vegetariano}
            onChange={(v) => campo("vegetariano", v)}
          />
          <Checkbox
            label="Trending"
            checked={valor.trending}
            onChange={(v) => campo("trending", v)}
          />
          <Checkbox
            label="Melhor avaliado"
            checked={valor.best}
            onChange={(v) => campo("best", v)}
          />
          <Checkbox
            label="Ativo"
            checked={valor.ativo}
            onChange={(v) => campo("ativo", v)}
          />
        </div>
        <div className="sm:col-span-2">
          <Campo label="Descrição">
            <textarea
              required
              rows={3}
              className="input"
              value={valor.descricao}
              onChange={(e) => campo("descricao", e.target.value)}
            />
          </Campo>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-lg font-bold">Opções</h2>
        <EditorOpcoes
          value={valor.opcoesJson}
          onChange={(v) => campo("opcoesJson", v)}
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-lg font-bold">Receita (markdown)</h2>
        <textarea
          required
          rows={12}
          className="input font-mono text-xs"
          value={valor.receitaMd}
          onChange={(e) => campo("receitaMd", e.target.value)}
        />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={salvando}
          className="rounded-full bg-primaria px-6 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(0 0 0 / 0.1);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #e2574c;
        }
      `}</style>
    </form>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
