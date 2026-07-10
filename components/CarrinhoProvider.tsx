"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Regiao } from "@prisma/client";
import { storage } from "@/lib/storage";
import type {
  ItemCarrinho,
  MotoboyPublico,
  OpcaoSelecionada,
  PedidoSalvo,
  Streak,
} from "@/lib/tipos";
import {
  calcularEconomia,
  calcularImpostos,
  calcularSubtotal,
  calcularTaxaEntrega,
  gerarChaveOpcoes,
  gerarIdPedido,
} from "@/lib/carrinho";
import { sortearMotoboy } from "@/lib/motoboys";
import { atualizarStreak, ganhouBonusHoje } from "@/lib/streak";

const STREAK_PADRAO: Streak = { dias: 0, ultimaData: null };

const MOTOBOY_PADRAO: MotoboyPublico = {
  id: "fallback",
  nome: "Motoboy Misterioso",
  avatarEmoji: "🏍️",
  frase: "Sumiu no mapa, mas tá vindo",
  raridade: "COMUM",
  pesoSorteio: 1,
};

type NovoItemCarrinho = {
  comidaId: string;
  nome: string;
  slug: string;
  fotoUrl: string;
  regiao: Regiao;
  precoUnitario: number;
  precoOriginalUnitario: number;
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

  enderecoIndice: number;
  trocarEndereco: () => void;

  checkoutAberto: boolean;
  abrirCheckout: () => void;
  fecharCheckout: () => void;

  motoboys: MotoboyPublico[];
  pedidos: PedidoSalvo[];
  criarPedido: () => PedidoSalvo | null;

  pedidoAtual: PedidoSalvo | null;
  trackingAberto: boolean;
  fecharTracking: () => void;
  marcarPedidoEntregue: (id: string) => void;

  entregaAberta: boolean;
  fecharEntrega: () => void;

  streak: Streak;
  figurinhasBonus: MotoboyPublico[];
  figurinhaBonusRecebida: MotoboyPublico | null;
};

const CarrinhoContext = createContext<CarrinhoContextValor | null>(null);

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [aberto, setAberto] = useState(false);
  const [enderecoIndice, setEnderecoIndice] = useState(0);
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [motoboys, setMotoboys] = useState<MotoboyPublico[]>([]);
  const [pedidos, setPedidos] = useState<PedidoSalvo[]>([]);
  const [pedidoAtual, setPedidoAtual] = useState<PedidoSalvo | null>(null);
  const [trackingAberto, setTrackingAberto] = useState(false);
  const [entregaAberta, setEntregaAberta] = useState(false);
  const [streak, setStreak] = useState<Streak>(STREAK_PADRAO);
  const [figurinhasBonus, setFigurinhasBonus] = useState<MotoboyPublico[]>([]);
  const [figurinhaBonusRecebida, setFigurinhaBonusRecebida] = useState<MotoboyPublico | null>(
    null
  );
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setItens(storage.getCarrinho());
    setEnderecoIndice(storage.getEnderecoIndice());
    setPedidos(storage.getPedidos());
    setStreak(storage.getStreak());
    setFigurinhasBonus(storage.getFigurinhasBonus());
    setCarregado(true);

    fetch("/api/motoboys")
      .then((res) => (res.ok ? res.json() : []))
      .then((dados) => setMotoboys(Array.isArray(dados) ? dados : []))
      .catch(() => setMotoboys([]));
  }, []);

  useEffect(() => {
    if (carregado) storage.setCarrinho(itens);
  }, [itens, carregado]);

  useEffect(() => {
    if (carregado) storage.setPedidos(pedidos);
  }, [pedidos, carregado]);

  useEffect(() => {
    if (carregado) storage.setStreak(streak);
  }, [streak, carregado]);

  useEffect(() => {
    if (carregado) storage.setFigurinhasBonus(figurinhasBonus);
  }, [figurinhasBonus, carregado]);

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
          regiao: novo.regiao,
          precoUnitario: novo.precoUnitario,
          precoOriginalUnitario: novo.precoOriginalUnitario,
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

  function trocarEndereco() {
    setEnderecoIndice((atual) => {
      const proximo = (atual + 1) % 3;
      storage.setEnderecoIndice(proximo);
      return proximo;
    });
  }

  function criarPedido(): PedidoSalvo | null {
    if (itens.length === 0) return null;

    const motoboy = motoboys.length > 0 ? sortearMotoboy(motoboys) : MOTOBOY_PADRAO;
    const subtotal = calcularSubtotal(itens);
    const economia = calcularEconomia(itens);
    const entrega = calcularTaxaEntrega(subtotal);
    const impostos = calcularImpostos(subtotal);
    const total = subtotal + entrega + impostos;

    const pedido: PedidoSalvo = {
      id: gerarIdPedido(),
      itens,
      subtotal,
      economia,
      entrega,
      impostos,
      total,
      criadoEm: new Date().toISOString(),
      motoboy,
      status: "a_caminho",
    };

    setPedidos((atual) => [...atual, pedido]);
    storage.incrementarContadorDesejos();

    const streakAntigo = streak;
    const streakNovo = atualizarStreak(streakAntigo);
    setStreak(streakNovo);

    setFigurinhaBonusRecebida(null);
    if (ganhouBonusHoje(streakAntigo, streakNovo) && motoboys.length > 0) {
      const bonus = sortearMotoboy(motoboys);
      setFigurinhasBonus((atual) => [...atual, bonus]);
      setFigurinhaBonusRecebida(bonus);
    }

    setItens([]);
    setCheckoutAberto(false);
    setPedidoAtual(pedido);
    setTrackingAberto(true);

    return pedido;
  }

  function fecharTracking() {
    setTrackingAberto(false);
  }

  function marcarPedidoEntregue(id: string) {
    setPedidoAtual((atual) =>
      atual && atual.id === id ? { ...atual, status: "entregue" } : atual
    );
    setPedidos((atual) =>
      atual.map((p) => (p.id === id ? { ...p, status: "entregue" as const } : p))
    );
    setTrackingAberto(false);
    setEntregaAberta(true);
  }

  function fecharEntrega() {
    setEntregaAberta(false);
    setPedidoAtual(null);
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

        enderecoIndice,
        trocarEndereco,

        checkoutAberto,
        abrirCheckout: () => {
          setAberto(false);
          setCheckoutAberto(true);
        },
        fecharCheckout: () => setCheckoutAberto(false),

        motoboys,
        pedidos,
        criarPedido,

        pedidoAtual,
        trackingAberto,
        fecharTracking,
        marcarPedidoEntregue,

        entregaAberta,
        fecharEntrega,

        streak,
        figurinhasBonus,
        figurinhaBonusRecebida,
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
