"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/comidas", label: "Comidas" },
  { href: "/admin/motoboys", label: "Motoboys" },
  { href: "/admin/config", label: "Configurações" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function sair() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="font-display text-lg font-bold text-primaria">
          pedidonuncachega · admin
        </span>
        <nav className="flex items-center gap-4 text-sm font-medium">
          {LINKS.map((link) => {
            const ativo =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={ativo ? "text-primaria" : "hover:text-primaria"}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={sair}
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:border-primaria hover:text-primaria"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
