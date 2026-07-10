import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [totalComidas, comidasAtivas, totalMotoboys, motoboysAtivos] =
    await Promise.all([
      prisma.comida.count(),
      prisma.comida.count({ where: { ativo: true } }),
      prisma.motoboy.count(),
      prisma.motoboy.count({ where: { ativo: true } }),
    ]);

  const cartoes = [
    { titulo: "Comidas ativas", valor: comidasAtivas, total: totalComidas },
    { titulo: "Motoboys ativos", valor: motoboysAtivos, total: totalMotoboys },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cartoes.map((cartao) => (
          <div
            key={cartao.titulo}
            className="rounded-xl border border-black/10 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-black/60">
              {cartao.titulo}
            </p>
            <p className="mt-2 font-display text-4xl font-bold text-primaria">
              {cartao.valor}
              <span className="ml-2 text-base font-normal text-black/40">
                / {cartao.total} no total
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
