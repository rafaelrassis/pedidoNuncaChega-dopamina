"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { storage } from "@/lib/storage";
import type { ItemCarrinho, OpcaoSelecionada } from "@/lib/tipos";
import { gerarChaveOpcoes } from "@/lib/carrinho";

type NovoItemCarrinho = {
  comidaId: string;
  nome: string;
  slug: string;
  fotoUrl: string;
  precoUnitario: number;
  quantidade: number;
  opcoes: OpcaoSelecionada[];
};

type CarrinhoContextValor = {
  itens: ItemCarrinho[];
  aberto: boolean;
  abrirCarrinho: () => void;
  fecharCarrinho: () => void;
  adicionarItem: (item: NovoItemCarrinho) => void;
  removerItem: (itemId: string) => void;
  atualizarQuantidade: (itemId: string, quantidade: number) => void;
  esvaziar: () => void;
};

const CarrinhoContext = createContext<CarrinhoContextValor | null>(null);

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [aberto, setAberto] = useState(false);
  const carregouRef = useRef(false);

  useEffect(() => {
    setItens(storage.getCarrinho());
    carregouRef.current = true;
  }, []);

  useEffect(() => {
    if (carregouRef.current) storage.setCarrinho(itens);
  }, [itens]);

  function adicionarItem(novo: NovoItemCarrinho) {
    const chaveNova = gerarChaveOpcoes(novo.opcoes);
    setItens((atual) => {
      const existente = atual.find(
        (i) => i.comidaId === novo.comidaId && gerarChaveOpcoes(i.opcoes) === chaveNova
      );
      if (existente) {
        return atual.map((i) =>
          i.itemId === existente.itemId
            ? { ...i, quantidade: i.quantidade + novo.quantidade }
            : i
        );
      }
      return [
        ...atual,
        {
          itemId: crypto.randomUUID(),
          comidaId: novo.comidaId,
          nome: novo.nome,
          slug: novo.slug,
          fotoUrl: novo.fotoUrl,
          precoUnitario: novo.precoUnitario,
          quantidade: novo.quantidade,
          opcoes: novo.opcoes,
        },
      ];
    });
    setAberto(true);
  }

  function removerItem(itemId: string) {
    setItens((atual) => atual.filter((i) => i.itemId !== itemId));
  }

  function atualizarQuantidade(itemId: string, quantidade: number) {
    if (quantidade <= 0) {
      removerItem(itemId);
      return;
    }
    setItens((atual) => atual.map((i) => (i.itemId === itemId ? { ...i, quantidade } : i)));
  }

  function esvaziar() {
    setItens([]);
  }

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        aberto,
        abrirCarrinho: () => setAberto(true),
        fecharCarrinho: () => setAberto(false),
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        esvaziar,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);
  if (!contexto) {
    throw new Error("useCarrinho precisa estar dentro de CarrinhoProvider");
  }
  return contexto;
}
