import Link from "next/link";

const LINKS = [
  { href: "/receitas", rotulo: "Receitas" },
  { href: "/sobre", rotulo: "Sobre" },
  { href: "/doar", rotulo: "Doar" },
  { href: "/privacidade", rotulo: "Privacidade" },
  { href: "/termos", rotulo: "Termos" },
  { href: "/contato", rotulo: "Contato" },
];

export default function Rodape() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-black/5 px-6 py-10 text-center text-sm text-foreground/60">
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 font-medium">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-primaria">
            {link.rotulo}
          </Link>
        ))}
      </nav>

      <p className="max-w-md text-xs text-foreground/40">
        as pessoas nos chamam de: comida que nunca chega, delivery fake, ifood de mentira,
        pedido fantasma, cadê o motoboy
      </p>

      <p>pedidonuncachega — seu motoboy está preso no trânsito desde 2019.</p>
    </footer>
  );
}
