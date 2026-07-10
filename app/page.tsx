import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Cabecalho />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-display text-4xl font-bold sm:text-6xl">
          Seu pedido <span className="text-primaria">nunca chega</span>.
        </h1>
        <p className="max-w-xl text-lg text-foreground/80">
          Peça comida fake, acompanhe o motoboy fake, colecione figurinhas de
          motoboy e ganhe dopamina grátis enquanto o app te enrola com carinho.
        </p>
        <button className="rounded-full bg-primaria px-8 py-3 font-semibold text-white transition hover:opacity-90">
          Fazer pedido
        </button>
      </main>
      <Rodape />
    </div>
  );
}
