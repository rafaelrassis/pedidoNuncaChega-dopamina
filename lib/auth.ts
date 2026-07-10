import { SignJWT, jwtVerify } from "jose";

export const COOKIE_SESSAO = "pnc_admin_sessao";
const DURACAO_SESSAO_SEGUNDOS = 60 * 60 * 24 * 7; // 7 dias

export type SessaoAdmin = {
  sub: string;
  email: string;
};

function segredo(): Uint8Array {
  const valor = process.env.JWT_SECRET;
  if (!valor) throw new Error("JWT_SECRET não configurado");
  return new TextEncoder().encode(valor);
}

export async function criarTokenSessao(admin: SessaoAdmin): Promise<string> {
  return new SignJWT({ email: admin.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.sub)
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_SESSAO_SEGUNDOS}s`)
    .sign(segredo());
}

export async function verificarTokenSessao(
  token: string
): Promise<SessaoAdmin | null> {
  try {
    const { payload } = await jwtVerify(token, segredo());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export const MAX_AGE_COOKIE_SESSAO = DURACAO_SESSAO_SEGUNDOS;
