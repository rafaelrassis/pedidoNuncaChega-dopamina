import { NextRequest, NextResponse } from "next/server";
import { COOKIE_SESSAO, verificarTokenSessao } from "@/lib/auth";

const ROTAS_PUBLICAS = ["/admin/login", "/api/admin/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (ROTAS_PUBLICAS.some((rota) => pathname === rota)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_SESSAO)?.value;
  const sessao = token ? await verificarTokenSessao(token) : null;

  if (!sessao) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
