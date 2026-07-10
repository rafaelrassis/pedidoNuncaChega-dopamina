import Link from "next/link";
import Markdown from "./Markdown";

type ComidaReceita = {
  nome: string;
  slug: string;
  descricao: string;
  receitaMd: string;
  fotoUrl: string;
};

export default function ReceitaConteudo({ comida }: { comida: ComidaReceita }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <Link href="/receitas" className="text-sm font-semibold text-primaria hover:underline">
        ← Todas as receitas
      </Link>

      <div>
        <h1 className="font-display text-3xl font-bold">{comida.nome}</h1>
        <p className="mt-1 text-foreground/70">{comida.descricao}</p>
      </div>

      <article className="rounded-2xl bg-white p-6 shadow-sm">
        <Markdown texto={comida.receitaMd} />
      </article>

      <Link
        href="/"
        className="self-start rounded-full bg-primaria px-6 py-3 font-semibold text-white transition hover:opacity-90"
      >
        Pedir este prato (ele não vem) 😄
      </Link>
    </main>
  );
}
