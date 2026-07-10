export default function Cabecalho() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <span className="font-display text-2xl font-bold text-primaria">
        pedidonuncachega
      </span>
      <nav className="flex gap-4 text-sm font-medium">
        <a href="#album" className="hover:text-primaria">
          Álbum
        </a>
        <a href="#passaporte" className="hover:text-primaria">
          Passaporte
        </a>
      </nav>
    </header>
  );
}
