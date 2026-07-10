"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const RARIDADES = ["COMUM", "RARO", "LENDARIO"] as const;

type ValorMotoboy = {
  nome: string;
  avatarEmoji: string;
  frase: string;
  raridade: (typeof RARIDADES)[number];
  pesoSorteio: number;
  ativo: boolean;
};

const VALOR_PADRAO: ValorMotoboy = {
  nome: "",
  avatarEmoji: "🏍️",
  frase: "",
  raridade: "COMUM",
  pesoSorteio: 10,
  ativo: true,
};

export default function MotoboyForm({
  inicial,
}: {
  inicial?: Partial<ValorMotoboy> & { id: string };
}) {
  const router = useRouter();
  const [valor, setValor] = useState<ValorMotoboy>({ ...VALOR_PADRAO, ...inicial });
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  function campo<K extends keyof ValorMotoboy>(chave: K, novo: ValorMotoboy[K]) {
    setValor((atual) => ({ ...atual, [chave]: novo }));
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setSalvando(true);

    const url = inicial?.id
      ? `/api/admin/motoboys/${inicial.id}`
      : "/api/admin/motoboys";
    const metodo = inicial?.id ? "PUT" : "POST";

    const resposta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valor),
    });

    setSalvando(false);

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(typeof dados.erro === "string" ? dados.erro : "Erro ao salvar motoboy");
      return;
    }

    router.push("/admin/motoboys");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:max-w-lg"
    >
      <label className="flex flex-col gap-1 text-sm font-medium">
        Nome
        <input
          required
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
          value={valor.nome}
          onChange={(e) => campo("nome", e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Emoji
        <input
          required
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
          value={valor.avatarEmoji}
          onChange={(e) => campo("avatarEmoji", e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Frase
        <input
          required
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
          value={valor.frase}
          onChange={(e) => campo("frase", e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Raridade
        <select
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
          value={valor.raridade}
          onChange={(e) => campo("raridade", e.target.value as ValorMotoboy["raridade"])}
        >
          {RARIDADES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Peso do sorteio
        <input
          type="number"
          min="1"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
          value={valor.pesoSorteio}
          onChange={(e) => campo("pesoSorteio", Number(e.target.value))}
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={valor.ativo}
          onChange={(e) => campo("ativo", e.target.checked)}
        />
        Ativo
      </label>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

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
