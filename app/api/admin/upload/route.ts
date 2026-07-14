import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const TIPOS_PERMITIDOS = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const TAMANHO_MAXIMO = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const arquivo = formData?.get("arquivo");
  const pasta = formData?.get("pasta");

  if (!(arquivo instanceof File)) {
    return NextResponse.json({ erro: "Nenhum arquivo enviado" }, { status: 400 });
  }
  if (!TIPOS_PERMITIDOS.has(arquivo.type)) {
    return NextResponse.json(
      { erro: "Formato não suportado (use JPG, PNG, WEBP ou GIF)" },
      { status: 400 }
    );
  }
  if (arquivo.size > TAMANHO_MAXIMO) {
    return NextResponse.json({ erro: "Arquivo maior que 5MB" }, { status: 400 });
  }

  const pastaSegura = typeof pasta === "string" && /^[a-z0-9-]+$/.test(pasta) ? pasta : "uploads";
  const extensao = arquivo.name.split(".").pop()?.toLowerCase() || "jpg";
  const nomeArquivo = `${pastaSegura}/${crypto.randomUUID()}.${extensao}`;

  const blob = await put(nomeArquivo, arquivo, { access: "public" });

  return NextResponse.json({ url: blob.url });
}
