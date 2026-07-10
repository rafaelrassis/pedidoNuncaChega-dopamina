import type { Regiao } from "@prisma/client";

const REGIOES: { valor: Regiao; rotulo: string; emoji: string }[] = [
  { valor: "NORDESTE", rotulo: "Nordeste", emoji: "🌵" },
  { valor: "NORTE", rotulo: "Norte", emoji: "🌳" },
  { valor: "SUDESTE", rotulo: "Sudeste", emoji: "🏙️" },
  { valor: "SUL", rotulo: "Sul", emoji: "🧉" },
  { valor: "CENTRO_OESTE", rotulo: "Centro-Oeste", emoji: "🌾" },
];

export default function ChipsRegiao({
  selecionada,
  onSelecionar,
}: {
  selecionada: Regiao | null;
  onSelecionar: (regiao: Regiao | null) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {REGIOES.map((r) => {
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
