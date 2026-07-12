import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

const TAMANHO = { width: 1200, height: 630 };

const CORES_RARIDADE: Record<string, { de: string; para: string; borda: string }> = {
  COMUM: { de: "#FFFFFF", para: "#F5F5F5", borda: "#E5E5E5" },
  RARO: { de: "#F1F5F9", para: "#CBD5E1", borda: "#94A3B8" },
  LENDARIO: { de: "#FEF3C7", para: "#FCD34D", borda: "#FBBF24" },
};

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const motoboy = await prisma.motoboy.findUnique({ where: { id: params.id } });

  if (!motoboy || !motoboy.ativo) {
    return new Response("Motoboy não encontrado", { status: 404 });
  }

  const cores = CORES_RARIDADE[motoboy.raridade] ?? CORES_RARIDADE.COMUM;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFF6F0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 440,
            height: 520,
            borderRadius: 40,
            border: `8px solid ${cores.borda}`,
            background: `linear-gradient(135deg, ${cores.de}, ${cores.para})`,
          }}
        >
          <div style={{ display: "flex", fontSize: 170 }}>{motoboy.avatarEmoji}</div>
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 700,
              color: "#1A1A1A",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            {motoboy.nome}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#555555",
              marginTop: 12,
              textAlign: "center",
            }}
          >
            &ldquo;{motoboy.frase}&rdquo;
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              color: "#888888",
              marginTop: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {motoboy.raridade}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 32,
            fontWeight: 800,
            color: "#E2574C",
          }}
        >
          🏍️👻 PedidoNuncaChega
        </div>
      </div>
    ),
    TAMANHO
  );
}
