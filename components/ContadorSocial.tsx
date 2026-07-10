"use client";

import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

export default function ContadorSocial() {
  const [contador, setContador] = useState<number | null>(null);

  useEffect(() => {
    setContador(storage.getContadorDesejos());
  }, []);

  if (contador === null) return null;

  return (
    <p className="text-sm font-medium text-foreground/60">
      {contador.toLocaleString("pt-BR")} desejos atendidos · R$ 0 gastos
    </p>
  );
}
