import { prisma } from "@/lib/prisma";
import ConfigForm from "@/components/admin/ConfigForm";

export default async function ConfigAdminPage() {
  const config = await prisma.configuracao.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      chavePix: "SUA_CHAVE_AQUI",
      nomeRecebedor: "",
      cidadeRecebedor: "",
      tiersDoacaoJson: [],
      textosJson: {},
    },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Configuração</h1>
      <ConfigForm
        inicial={{
          chavePix: config.chavePix,
          nomeRecebedor: config.nomeRecebedor,
          cidadeRecebedor: config.cidadeRecebedor,
          tiersDoacaoJson: config.tiersDoacaoJson as { valor: number; rotulo: string }[],
          textosJson: config.textosJson as Record<string, string>,
        }}
      />
    </div>
  );
}
