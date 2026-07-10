import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "pnc_admin_session";

const ALGORITMO = "HS256";
const EXPIRACAO = "7d";

function obterSegredo() {
  const segredo = process.env.JWT_SECRET;
  if (!segredo) {
    throw new Error("JWT_SECRET não configurado");
  }
  return new TextEncoder().encode(segredo);
}

export type SessaoAdmin = {
  adminId: string;
  email: string;
};

export async function criarTokenAdmin(payload: SessaoAdmin): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITMO })
    .setIssuedAt()
    .setExpirationTime(EXPIRACAO)
    .sign(obterSegredo());
}

export async function verificarTokenAdmin(
  token: string
): Promise<SessaoAdmin | null> {
  try {
    const { payload } = await jwtVerify(token, obterSegredo());
    if (typeof payload.adminId !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { adminId: payload.adminId, email: payload.email };
  } catch {
    return null;
  }
}
