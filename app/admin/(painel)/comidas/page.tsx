import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AlternarAtivo from "@/components/admin/AlternarAtivo";

export default async function ListaComidasPage() {
  const comidas = await prisma.comida.findMany({ orderBy: { nome: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Comidas</h1>
        <Link
          href="/admin/comidas/novo"
          className="rounded-full bg-primaria px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          + Nova comida
        </Link>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-foreground/60">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Região</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Desconto</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {comidas.map((c) => (
              <tr key={c.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">{c.nome}</td>
                <td className="px-4 py-3">{c.regiao}</td>
                <td className="px-4 py-3">R$ {Number(c.precoFake).toFixed(2)}</td>
                <td className="px-4 py-3">{c.descontoPct}%</td>
                <td className="px-4 py-3">
                  <span className={c.ativo ? "text-destaque" : "text-foreground/40"}>
                    {c.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/comidas/${c.id}`}
                      className="text-primaria hover:underline"
                    >
                      Editar
                    </Link>
                    <AlternarAtivo id={c.id} ativo={c.ativo} recurso="comidas" />
                  </div>
                </td>
              </tr>
            ))}
            {comidas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground/50">
                  Nenhuma comida cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
