import type { Metadata } from "next";
import Link from "next/link";
import BotaoSair from "@/components/admin/BotaoSair";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function LayoutPainelAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-fundo">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 bg-white px-6 py-4">
        <span className="font-display text-xl font-bold text-primaria">
          pedidonuncachega · admin
        </span>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link href="/admin" className="hover:text-primaria">
            Dashboard
          </Link>
          <Link href="/admin/comidas" className="hover:text-primaria">
            Comidas
          </Link>
          <Link href="/admin/motoboys" className="hover:text-primaria">
            Motoboys
          </Link>
          <Link href="/admin/config" className="hover:text-primaria">
            Configuração
          </Link>
          <Link href="/admin/senha" className="hover:text-primaria">
            Senha
          </Link>
          <BotaoSair />
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
