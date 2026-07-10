import { NextResponse } from "next/server";
import { createStaticPix, hasError } from "pix-utils";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const valorParam = searchParams.get("valor");

  const config = await prisma.configuracao.findUnique({ where: { id: 1 } });

  if (!config || config.chavePix === "SUA_CHAVE_AQUI") {
    return NextResponse.json({ configurado: false });
  }

  if (!valorParam) {
    return NextResponse.json({ configurado: true, tiers: config.tiersDoacaoJson });
  }

  const valor = Number(valorParam);
  if (!Number.isFinite(valor) || valor <= 0) {
    return NextResponse.json({ erro: "Valor inválido" }, { status: 400 });
  }

  const pix = createStaticPix({
    merchantName: config.nomeRecebedor,
    merchantCity: config.cidadeRecebedor,
    pixKey: config.chavePix,
    transactionAmount: valor,
    infoAdicional: "Doacao PedidoNuncaChega",
  });

  if (hasError(pix)) {
    return NextResponse.json({ erro: pix.message }, { status: 500 });
  }

  const payload = pix.toBRCode();
  const qrCodeDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 320 });

  return NextResponse.json({ configurado: true, payload, qrCodeDataUrl });
}
