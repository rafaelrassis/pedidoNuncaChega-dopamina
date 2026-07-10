import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verificarTokenAdmin } from "@/lib/auth";

const ROTAS_PUBLICAS = new Set(["/admin/login", "/api/admin/login"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ehApi = pathname.startsWith("/api/admin");

  if (ROTAS_PUBLICAS.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const sessao = token ? await verificarTokenAdmin(token) : null;

  if (!sessao) {
    if (ehApi) {
      return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
