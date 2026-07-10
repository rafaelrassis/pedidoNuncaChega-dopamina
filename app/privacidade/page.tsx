import type { Metadata } from "next";
import LayoutPublico from "@/components/LayoutPublico";

export const metadata: Metadata = {
  title: "Privacidade",
  description:
    "Sem contas, sem login: seus dados de jogo ficam só no seu navegador. Veja como o PedidoNuncaChega trata sua privacidade.",
};

export default function PrivacidadePage() {
  return (
    <LayoutPublico>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-10">
        <h1 className="font-display text-2xl font-bold">Privacidade</h1>
        <p className="text-foreground/70">
          O PedidoNuncaChega não tem contas de usuário nem login. Tudo o que você faz aqui —
          pedidos, álbum de figurinhas, passaporte, ofensiva — fica salvo só no{" "}
          <strong>localStorage do seu navegador</strong>, no seu próprio aparelho. Nada disso é
          enviado para nenhum servidor nosso.
        </p>
        <p className="text-foreground/70">
          Se você limpar os dados do navegador ou trocar de aparelho, esse progresso se perde —
          e está tudo bem, porque nada aqui é levado tão a sério assim.
        </p>
        <p className="text-foreground/70">
          A única informação que sai do seu navegador é, opcionalmente, um pagamento PIX real
          caso você escolha apoiar o site na página <strong>/doar</strong>. Esse pagamento é
          processado pelo seu próprio banco/app de pagamentos — nós não armazenamos nenhum dado
          financeiro.
        </p>
      </main>
    </LayoutPublico>
  );
}
