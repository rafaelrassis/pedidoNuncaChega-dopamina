import LayoutPublico from "@/components/LayoutPublico";
import DoacaoCard from "@/components/DoacaoCard";

export default function DoarPage() {
  return (
    <LayoutPublico>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-6 py-10">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Apoiar o PedidoNuncaChega</h1>
          <p className="mt-2 text-sm text-foreground/60">
            O site é grátis e sempre vai ser. Doação é 100% opcional e nunca destrava nada no
            jogo.
          </p>
        </div>
        <DoacaoCard />
      </main>
    </LayoutPublico>
  );
}
