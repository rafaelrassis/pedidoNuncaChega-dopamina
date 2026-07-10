import Link from "next/link";

export default function Rodape() {
  return (
    <footer className="flex flex-col items-center gap-2 px-6 py-8 text-center text-sm text-foreground/60">
      <Link href="/doar" className="font-semibold text-primaria hover:underline">
        🏍️👻 Apoiar o site
      </Link>
      <p>pedidonuncachega — seu motoboy está preso no trânsito desde 2019.</p>
    </footer>
  );
}
