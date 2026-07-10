import type { Regiao } from "@prisma/client";
import { REGIOES_INFO } from "@/lib/regioes";

export default function ChipsRegiao({
  selecionada,
  onSelecionar,
}: {
  selecionada: Regiao | null;
  onSelecionar: (regiao: Regiao | null) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {REGIOES_INFO.map((r) => {
        const ativo = selecionada === r.valor;
        return (
          <button
            key={r.valor}
            onClick={() => onSelecionar(ativo ? null : r.valor)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              ativo
                ? "border-primaria bg-primaria text-white"
                : "border-black/10 bg-white text-foreground/70 hover:border-primaria"
            }`}
          >
            {r.emoji} {r.rotulo}
          </button>
        );
      })}
    </div>
  );
}
