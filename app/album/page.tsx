"use client";

import { CarrinhoProvider } from "@/components/CarrinhoProvider";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import AlbumConteudo from "@/components/AlbumConteudo";

export default function AlbumPage() {
  return (
    <CarrinhoProvider>
      <div className="flex min-h-screen flex-col bg-fundo">
        <Cabecalho />
        <AlbumConteudo />
        <Rodape />
      </div>
    </CarrinhoProvider>
  );
}
