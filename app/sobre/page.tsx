import type { Metadata } from "next";
import LayoutPublico from "@/components/LayoutPublico";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "O que é o PedidoNuncaChega, é golpe, é grátis mesmo, e de onde vem o dinheiro — tudo explicado.",
};

const FAQ = [
  {
    pergunta: "É golpe?",
    resposta:
      "Não. Não pedimos cartão, CPF ou senha de nada. Você não paga nada de verdade — a única coisa real aqui é a opção de doar, e ela é 100% opcional.",
  },
  {
    pergunta: "É grátis mesmo?",
    resposta:
      "Sim, sempre. Sem cadastro, sem assinatura, sem \"versão premium\" escondida.",
  },
  {
    pergunta: "Por que a comida nunca chega?",
    resposta:
      "Porque não existe comida de verdade — é tudo fake, pensado pra você sentir a dopamina do \"pedido chegando\" sem gastar um centavo nem uma caloria.",
  },
  {
    pergunta: "De onde vem o dinheiro pra manter o site no ar?",
    resposta:
      "De doações opcionais via PIX (veja a página /doar). Sem anúncios agressivos, sem venda de dados.",
  },
];

export default function SobrePage() {
  return (
    <LayoutPublico>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-10">
        <div>
          <h1 className="font-display text-2xl font-bold">Sobre o PedidoNuncaChega</h1>
          <p className="mt-2 text-foreground/70">
            PedidoNuncaChega é um delivery fake de comida brasileira. Você escolhe um prato,
            acompanha um motoboy fictício numa entrega que nunca acontece, e ainda assim ganha
            a sensação boa de &ldquo;pedido a caminho&rdquo; — de graça. No caminho, você
            coleciona figurinhas de motoboys e carimba seu passaporte gastronômico do Brasil.
          </p>
        </div>

        <div>
          <h2 className="mb-4 font-display text-xl font-bold">Perguntas frequentes</h2>
          <div className="flex flex-col gap-4">
            {FAQ.map((item) => (
              <div key={item.pergunta} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="font-semibold">{item.pergunta}</p>
                <p className="mt-1 text-sm text-foreground/70">{item.resposta}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </LayoutPublico>
  );
}
