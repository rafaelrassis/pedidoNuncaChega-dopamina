"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function aoSubmeter(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const resposta = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}));
        setErro(dados.erro ?? "Não foi possível entrar");
        return;
      }
      const destino = searchParams.get("redirect") || "/admin";
      router.push(destino);
      router.refresh();
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-fundo px-4">
      <div className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-primaria">
          Admin
        </h1>
        <p className="mt-1 text-sm text-black/60">pedidonuncachega</p>

        <form onSubmit={aoSubmeter} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primaria"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="senha" className="text-sm font-medium">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primaria"
            />
          </div>

          {erro && <p className="text-sm text-primaria">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="mt-2 rounded-lg bg-primaria px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
