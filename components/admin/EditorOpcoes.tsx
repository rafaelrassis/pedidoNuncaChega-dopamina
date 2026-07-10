"use client";

export type OpcaoItem = { nome: string; acrescimo: number };
export type GrupoOpcoes = {
  grupo: string;
  tipo: "radio" | "checkbox";
  opcoes: OpcaoItem[];
};

export default function EditorOpcoes({
  value,
  onChange,
}: {
  value: GrupoOpcoes[];
  onChange: (valor: GrupoOpcoes[]) => void;
}) {
  function adicionarGrupo() {
    onChange([
      ...value,
      { grupo: "", tipo: "radio", opcoes: [{ nome: "", acrescimo: 0 }] },
    ]);
  }

  function removerGrupo(indiceGrupo: number) {
    onChange(value.filter((_, i) => i !== indiceGrupo));
  }

  function atualizarGrupo(indiceGrupo: number, campos: Partial<GrupoOpcoes>) {
    onChange(value.map((g, i) => (i === indiceGrupo ? { ...g, ...campos } : g)));
  }

  function adicionarOpcao(indiceGrupo: number) {
    atualizarGrupo(indiceGrupo, {
      opcoes: [...value[indiceGrupo].opcoes, { nome: "", acrescimo: 0 }],
    });
  }

  function removerOpcao(indiceGrupo: number, indiceOpcao: number) {
    atualizarGrupo(indiceGrupo, {
      opcoes: value[indiceGrupo].opcoes.filter((_, i) => i !== indiceOpcao),
    });
  }

  function atualizarOpcao(
    indiceGrupo: number,
    indiceOpcao: number,
    campos: Partial<OpcaoItem>
  ) {
    atualizarGrupo(indiceGrupo, {
      opcoes: value[indiceGrupo].opcoes.map((o, i) =>
        i === indiceOpcao ? { ...o, ...campos } : o
      ),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((grupo, indiceGrupo) => (
        <div key={indiceGrupo} className="rounded-xl border border-black/10 p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <input
              className="flex-1 rounded-lg border border-black/10 px-3 py-1.5 text-sm outline-none focus:border-primaria"
              placeholder="Nome do grupo (ex: Porção)"
              value={grupo.grupo}
              onChange={(e) => atualizarGrupo(indiceGrupo, { grupo: e.target.value })}
            />
            <select
              className="rounded-lg border border-black/10 px-2 py-1.5 text-sm"
              value={grupo.tipo}
              onChange={(e) =>
                atualizarGrupo(indiceGrupo, {
                  tipo: e.target.value as "radio" | "checkbox",
                })
              }
            >
              <option value="radio">Escolha única</option>
              <option value="checkbox">Múltipla escolha</option>
            </select>
            <button
              type="button"
              onClick={() => removerGrupo(indiceGrupo)}
              className="text-sm text-red-600 hover:underline"
            >
              Remover grupo
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {grupo.opcoes.map((opcao, indiceOpcao) => (
              <div key={indiceOpcao} className="flex items-center gap-2">
                <input
                  className="flex-1 rounded-lg border border-black/10 px-3 py-1 text-sm outline-none focus:border-primaria"
                  placeholder="Nome da opção"
                  value={opcao.nome}
                  onChange={(e) =>
                    atualizarOpcao(indiceGrupo, indiceOpcao, { nome: e.target.value })
                  }
                />
                <input
                  type="number"
                  step="0.01"
                  className="w-28 rounded-lg border border-black/10 px-3 py-1 text-sm outline-none focus:border-primaria"
                  placeholder="Acréscimo"
                  value={opcao.acrescimo}
                  onChange={(e) =>
                    atualizarOpcao(indiceGrupo, indiceOpcao, {
                      acrescimo: Number(e.target.value),
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => removerOpcao(indiceGrupo, indiceOpcao)}
                  className="text-sm text-red-600"
                  aria-label="Remover opção"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => adicionarOpcao(indiceGrupo)}
              className="self-start text-sm text-destaque hover:underline"
            >
              + Opção
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={adicionarGrupo}
        className="self-start rounded-full border border-primaria px-4 py-1.5 text-sm text-primaria transition hover:bg-primaria hover:text-white"
      >
        + Grupo de opções
      </button>
    </div>
  );
}
