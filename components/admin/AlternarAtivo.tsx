"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AlternarAtivo({
  id,
  ativo,
  recurso,
}: {
  id: string;
  ativo: boolean;
  recurso: "comidas" | "motoboys";
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function alternar() {
    setCarregando(true);
    await fetch(`/api/admin/${recurso}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !ativo }),
    });
    setCarregando(false);
    router.refresh();
  }

  return (
    <button
      onClick={alternar}
      disabled={carregando}
      className="text-foreground/60 hover:text-primaria disabled:opacity-50"
    >
      {ativo ? "Desativar" : "Reativar"}
    </button>
  );
}
