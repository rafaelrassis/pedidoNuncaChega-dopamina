"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { exportarProgresso, importarProgresso } from "@/lib/backup";

export default function BackupProgresso() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState<string | null>(null);

  function exportar() {
    const json = exportarProgresso();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pedidonuncachega-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function abrirSeletorArquivo() {
    setErro(null);
    inputRef.current?.click();
  }

  async function aoSelecionarArquivo(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;

    const confirmado = window.confirm(
      "Isso substitui seu progresso atual (pedidos, álbum, passaporte, ofensiva) pelo do arquivo. Continuar?"
    );
    if (!confirmado) return;

    const texto = await arquivo.text();
    const resultado = importarProgresso(texto);
    if (!resultado.sucesso) {
      setErro(resultado.erro);
      return;
    }
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 text-sm shadow-sm">
      <div>
        <h2 className="font-display text-base font-bold">💾 Backup da sua barriga virtual</h2>
        <p className="mt-1 text-xs text-foreground/60">
          Exporte seu progresso pra guardar num arquivo, ou importe um backup salvo antes.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={exportar}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:border-primaria"
        >
          ⬇️ Exportar
        </button>
        <button
          onClick={abrirSeletorArquivo}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:border-primaria"
        >
          ⬆️ Importar
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={aoSelecionarArquivo}
        />
      </div>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  );
}
