"use client";

import { useState, type FormEvent } from "react";

export default function SenhaForm() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setSucesso(false);

    if (novaSenha !== confirmacao) {
      setErro("A confirmação não bate com a nova senha");
      return;
    }
    if (novaSenha.length < 8) {
      setErro("A nova senha precisa ter no mínimo 8 caracteres");
      return;
    }

    setSalvando(true);
    const resposta = await fetch("/api/admin/senha", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senhaAtual, novaSenha, confirmacao }),
    });
    setSalvando(false);

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(typeof dados.erro === "string" ? dados.erro : "Erro ao trocar a senha");
      return;
    }

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmacao("");
    setSucesso(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm"
    >
      <label className="flex flex-col gap-1 text-sm font-medium">
        Senha atual
        <input
          required
          type="password"
          autoComplete="current-password"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Nova senha
        <input
          required
          type="password"
          minLength={8}
          autoComplete="new-password"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Confirmar nova senha
        <input
          required
          type="password"
          minLength={8}
          autoComplete="new-password"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
        />
      </label>

      {erro && <p className="text-sm text-red-600">{erro}</p>}
      {sucesso && <p className="text-sm text-destaque">Senha trocada com sucesso.</p>}

      <button
        type="submit"
        disabled={salvando}
        className="self-start rounded-full bg-primaria px-6 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {salvando ? "Salvando..." : "Trocar senha"}
      </button>
    </form>
  );
}
