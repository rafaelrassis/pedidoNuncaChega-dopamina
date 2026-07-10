import ContadorSocial from "./ContadorSocial";

export default function Hero() {
  return (
    <section className="flex flex-col items-center gap-4 px-6 pb-8 pt-10 text-center">
      <h1 className="max-w-2xl font-display text-3xl font-bold sm:text-5xl">
        Peça sem culpa. A comida <span className="text-primaria">nunca chega</span> — a
        dopamina <span className="text-destaque">sim</span>. 🧠
      </h1>
      <p className="max-w-xl text-foreground/70">
        Grátis, sem cadastro, sem cobrança.
      </p>
      <ContadorSocial />
    </section>
  );
}
