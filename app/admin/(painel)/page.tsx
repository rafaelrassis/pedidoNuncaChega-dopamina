import { prisma } from "@/lib/prisma";

export default async function DashboardAdminPage() {
  const [comidasAtivas, motoboysAtivos] = await Promise.all([
    prisma.comida.count({ where: { ativo: true } }),
    prisma.motoboy.count({ where: { ativo: true } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-foreground/60">Comidas ativas</p>
          <p className="font-display text-4xl font-bold text-primaria">
            {comidasAtivas}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-foreground/60">Motoboys ativos</p>
          <p className="font-display text-4xl font-bold text-destaque">
            {motoboysAtivos}
          </p>
        </div>
      </div>
    </div>
  );
}
