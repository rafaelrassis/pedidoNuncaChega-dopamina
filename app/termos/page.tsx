import LayoutPublico from "@/components/LayoutPublico";

export default function TermosPage() {
  return (
    <LayoutPublico>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-10">
        <h1 className="font-display text-2xl font-bold">Termos de uso</h1>
        <p className="text-foreground/70">
          O PedidoNuncaChega é um site de entretenimento. Nenhum prato, motoboy ou entrega
          mostrado aqui é real. Nenhum pedido feito no site gera cobrança nem entrega de comida
          de verdade.
        </p>
        <p className="text-foreground/70">
          Não há cadastro, login ou coleta de dados pessoais. O uso do site é livre e gratuito.
        </p>
        <p className="text-foreground/70">
          A única transação real possível é a doação opcional via PIX, disponível na página{" "}
          <strong>/doar</strong>. Doação nunca desbloqueia nenhuma vantagem no site — figurinhas,
          passaporte e ofensiva são conquistados só usando o site normalmente.
        </p>
        <p className="text-foreground/70">
          O conteúdo do site pode mudar a qualquer momento, sem aviso prévio, porque afinal seu
          motoboy também nunca avisa quando vai chegar.
        </p>
      </main>
    </LayoutPublico>
  );
}
