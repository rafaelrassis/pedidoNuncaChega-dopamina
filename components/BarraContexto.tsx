"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { ENDERECOS_DISPONIVEIS } from "@/lib/tipos";

export default function BarraContexto() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    setIndice(storage.getEnderecoIndice());
  }, []);

  function trocar() {
    setIndice((atual) => {
      const proximo = (atual + 1) % ENDERECOS_DISPONIVEIS.length;
      storage.setEnderecoIndice(proximo);
      return proximo;
    });
  }

  const endereco = ENDERECOS_DISPONIVEIS[indice];

  return (
    <button
      onClick={trocar}
      title="Toque para trocar o endereço"
      className="mx-auto flex w-full max-w-fit items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-foreground/70 shadow-sm transition hover:text-primaria sm:text-sm"
    >
      ENTREGAR EM {endereco.emoji} {endereco.texto} · {endereco.tempoMin} min
    </button>
  );
}
