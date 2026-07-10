"use client";

import { useEffect, useState } from "react";

type EventoInstalacao = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function BotaoInstalarApp() {
  const [eventoDiferido, setEventoDiferido] = useState<EventoInstalacao | null>(null);

  useEffect(() => {
    function aoFicarInstalavel(evento: Event) {
      evento.preventDefault();
      setEventoDiferido(evento as EventoInstalacao);
    }
    function aoInstalar() {
      setEventoDiferido(null);
    }

    window.addEventListener("beforeinstallprompt", aoFicarInstalavel);
    window.addEventListener("appinstalled", aoInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", aoFicarInstalavel);
      window.removeEventListener("appinstalled", aoInstalar);
    };
  }, []);

  if (!eventoDiferido) return null;

  async function instalar() {
    if (!eventoDiferido) return;
    await eventoDiferido.prompt();
    await eventoDiferido.userChoice;
    setEventoDiferido(null);
  }

  return (
    <button
      onClick={instalar}
      title="Instale pra proteger seu álbum e sua ofensiva 🔥"
      className="rounded-full border border-primaria px-3 py-1.5 text-xs font-semibold text-primaria transition hover:bg-primaria hover:text-white"
    >
      ⬇️ Instalar app
    </button>
  );
}
