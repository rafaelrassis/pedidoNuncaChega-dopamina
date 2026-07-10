import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AlternarAtivo from "@/components/admin/AlternarAtivo";

export default async function ListaMotoboysPage() {
  const motoboys = await prisma.motoboy.findMany({ orderBy: { nome: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Motoboys</h1>
        <Link
          href="/admin/motoboys/novo"
          className="rounded-full bg-primaria px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          + Novo motoboy
        </Link>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-foreground/60">
            <tr>
              <th className="px-4 py-3">Motoboy</th>
              <th className="px-4 py-3">Frase</th>
              <th className="px-4 py-3">Raridade</th>
              <th className="px-4 py-3">Peso</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {motoboys.map((m) => (
              <tr key={m.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <span className="mr-2">{m.avatarEmoji}</span>
                  {m.nome}
                </td>
                <td className="px-4 py-3 text-foreground/70">{m.frase}</td>
                <td className="px-4 py-3">{m.raridade}</td>
                <td className="px-4 py-3">{m.pesoSorteio}</td>
                <td className="px-4 py-3">
                  <span className={m.ativo ? "text-destaque" : "text-foreground/40"}>
                    {m.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/motoboys/${m.id}`}
                      className="text-primaria hover:underline"
                    >
                      Editar
                    </Link>
                    <AlternarAtivo id={m.id} ativo={m.ativo} recurso="motoboys" />
                  </div>
                </td>
              </tr>
            ))}
            {motoboys.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground/50">
                  Nenhum motoboy cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
