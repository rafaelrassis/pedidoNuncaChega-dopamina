import LayoutPublico from "@/components/LayoutPublico";

export default function ContatoPage() {
  return (
    <LayoutPublico>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-10">
        <h1 className="font-display text-2xl font-bold">Contato</h1>
        <p className="text-foreground/70">
          Dúvidas, sugestões ou quer contar qual figurinha você tirou? Manda um e-mail:
        </p>
        <a
          href="mailto:contato@pedidonuncachega.com.br"
          className="self-start rounded-full bg-primaria px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          ✉️ contato@pedidonuncachega.com.br
        </a>
      </main>
    </LayoutPublico>
  );
}
