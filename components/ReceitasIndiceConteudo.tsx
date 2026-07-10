import Link from "next/link";
import type { Regiao } from "@prisma/client";
import { REGIOES_INFO } from "@/lib/regioes";

type ComidaResumo = { nome: string; slug: string; regiao: Regiao };

export default function ReceitasIndiceConteudo({ comidas }: { comidas: ComidaResumo[] }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
      <div>
        <h1 className="font-display text-2xl font-bold">Receitas</h1>
        <p className="mt-1 text-sm text-foreground/60">
          A comida nunca chega, mas a receita é real e grátis.
        </p>
      </div>
      {REGIOES_INFO.map((regiaoInfo) => {
        const doRegiao = comidas.filter((c) => c.regiao === regiaoInfo.valor);
        if (doRegiao.length === 0) return null;
        return (
          <div key={regiaoInfo.valor}>
            <h2 className="mb-2 font-display text-lg font-bold">
              {regiaoInfo.emoji} {regiaoInfo.rotulo}
            </h2>
            <ul className="flex flex-col gap-1">
              {doRegiao.map((c) => (
                <li key={c.slug}>
                  <Link href={`/receitas/${c.slug}`} className="text-primaria hover:underline">
                    {c.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </main>
  );
}
