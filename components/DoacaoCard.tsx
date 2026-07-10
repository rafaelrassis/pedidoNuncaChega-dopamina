"use client";

import { useEffect, useState } from "react";
import { formatarPreco } from "@/lib/carrinho";

type Tier = { valor: number; rotulo: string };

type DadosPix = { payload: string; qrCodeDataUrl: string };

export default function DoacaoCard({ colapsavel = false }: { colapsavel?: boolean }) {
  const [configurado, setConfigurado] = useState<boolean | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [aberto, setAberto] = useState(!colapsavel);
  const [valorLivre, setValorLivre] = useState("");
  const [dadosPix, setDadosPix] = useState<DadosPix | null>(null);
  const [carregandoPix, setCarregandoPix] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/doacao")
      .then((res) => res.json())
      .then((dados) => {
        setConfigurado(Boolean(dados.configurado));
        setTiers(Array.isArray(dados.tiers) ? dados.tiers : []);
      })
      .catch(() => setConfigurado(false));
  }, []);

  async function escolherValor(valor: number) {
    if (!(valor > 0)) return;
    setErro(null);
    setDadosPix(null);
    setCopiado(false);
    setCarregandoPix(true);
    try {
      const res = await fetch(`/api/doacao?valor=${valor}`);
      const dados = await res.json();
      if (!res.ok || !dados.configurado) {
        setErro("Não foi possível gerar o PIX agora.");
        return;
      }
      setDadosPix({ payload: dados.payload, qrCodeDataUrl: dados.qrCodeDataUrl });
    } catch {
      setErro("Não foi possível gerar o PIX agora.");
    } finally {
      setCarregandoPix(false);
    }
  }

  function agoraNao() {
    setDadosPix(null);
    setErro(null);
    setValorLivre("");
    setCopiado(false);
    if (colapsavel) setAberto(false);
  }

  async function copiarPayload() {
    if (!dadosPix) return;
    try {
      await navigator.clipboard.writeText(dadosPix.payload);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // ambiente sem permissão de clipboard
    }
  }

  if (configurado === null || configurado === false) return null;

  if (colapsavel && !aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="flex w-full items-center justify-between rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-primaria"
      >
        <span className="font-display text-sm font-bold">
          Gostou da entrega que não veio? 🏍️👻
        </span>
        <span className="text-sm font-semibold text-primaria">Apoiar →</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5">
      <h3 className="font-display text-lg font-bold">
        Gostou da entrega que não veio? 🏍️👻
      </h3>

      {!dadosPix ? (
        <>
          <div className="flex flex-wrap gap-2">
            {tiers.map((tier) => (
              <button
                key={tier.valor}
                onClick={() => escolherValor(tier.valor)}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:border-primaria"
              >
                {formatarPreco(tier.valor)} · {tier.rotulo}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Outro valor"
              value={valorLivre}
              onChange={(e) => setValorLivre(e.target.value)}
              className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
            />
            <button
              onClick={() => escolherValor(Number(valorLivre))}
              disabled={!(Number(valorLivre) > 0)}
              className="rounded-lg bg-primaria px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              Doar
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dadosPix.qrCodeDataUrl}
            alt="QR Code PIX"
            className="h-56 w-56 rounded-xl border border-black/10"
          />
          <div className="flex w-full items-center gap-2 rounded-xl border border-black/10 bg-fundo px-3 py-2">
            <code className="flex-1 truncate text-xs">{dadosPix.payload}</code>
            <button
              onClick={copiarPayload}
              className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm"
            >
              {copiado ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <p className="text-center text-xs font-semibold text-primaria">
            ⚠️ Este PIX é DE VERDADE — só pague se quiser apoiar o site (servidor + café)
          </p>
        </div>
      )}

      {carregandoPix && (
        <p className="text-center text-xs text-foreground/50">Gerando PIX...</p>
      )}
      {erro && <p className="text-center text-xs text-red-600">{erro}</p>}

      <button
        onClick={agoraNao}
        className="self-center text-sm font-semibold text-foreground/50 hover:text-foreground"
      >
        Agora não
      </button>
    </div>
  );
}
