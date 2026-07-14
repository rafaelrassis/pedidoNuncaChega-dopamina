"use client";

import { useRef, useState, type ChangeEvent } from "react";

export default function UploadImagem({
  value,
  onChange,
  pasta,
}: {
  value: string;
  onChange: (url: string) => void;
  pasta: "comidas" | "motoboys";
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleArquivo(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    setErro(null);
    setEnviando(true);

    const formData = new FormData();
    formData.append("arquivo", arquivo);
    formData.append("pasta", pasta);

    const resposta = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setEnviando(false);

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}));
      setErro(typeof dados.erro === "string" ? dados.erro : "Erro ao enviar imagem");
      return;
    }

    const dados = await resposta.json();
    onChange(dados.url);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Prévia da foto"
          className="h-32 w-32 rounded-lg border border-black/10 object-cover"
        />
      )}
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleArquivo}
          disabled={enviando}
          className="text-sm"
        />
        {enviando && <span className="text-xs text-foreground/50">Enviando...</span>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ou cole uma URL"
        className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primaria"
      />
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  );
}
