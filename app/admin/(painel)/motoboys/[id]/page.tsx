import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MotoboyForm from "@/components/admin/MotoboyForm";

export default async function EditarMotoboyPage({
  params,
}: {
  params: { id: string };
}) {
  const motoboy = await prisma.motoboy.findUnique({ where: { id: params.id } });
  if (!motoboy) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Editar motoboy</h1>
      <MotoboyForm
        inicial={{
          id: motoboy.id,
          nome: motoboy.nome,
          avatarEmoji: motoboy.avatarEmoji,
          fotoUrl: motoboy.fotoUrl ?? "",
          frase: motoboy.frase,
          raridade: motoboy.raridade,
          pesoSorteio: motoboy.pesoSorteio,
          ativo: motoboy.ativo,
        }}
      />
    </div>
  );
}
