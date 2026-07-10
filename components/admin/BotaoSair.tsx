"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BotaoSair() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      disabled={saindo}
      className="rounded-full border border-primaria px-4 py-1 text-sm text-primaria transition hover:bg-primaria hover:text-white disabled:opacity-60"
    >
      Sair
    </button>
  );
}
