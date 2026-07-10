"use client";

import { CarrinhoProvider } from "./CarrinhoProvider";
import Cabecalho from "./Cabecalho";
import Rodape from "./Rodape";

export default function LayoutPublico({ children }: { children: React.ReactNode }) {
  return (
    <CarrinhoProvider>
      <div className="flex min-h-screen flex-col bg-fundo">
        <Cabecalho />
        {children}
        <Rodape />
      </div>
    </CarrinhoProvider>
  );
}
