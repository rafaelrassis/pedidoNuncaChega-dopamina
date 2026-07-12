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
import { calcularAlbum } from "@/lib/album";
import { calcularRegioesColetadas } from "@/lib/passaporte";
import { calcularConquistas, type Conquista } from "@/lib/conquistas";
import {
  type RepetidasConsumidas,
  consumirRepetidas,
  contarRepetidasDisponiveis,
  podeTrocar,
  sortearTroca,
} from "@/lib/troca";

const STREAK_PADRAO: Streak = { dias: 0, ultimaData: null };

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
  avaliarPedido: (id: string, nota: number) => void;

  entregaAberta: boolean;
  fecharEntrega: () => void;

  streak: Streak;
  figurinhasBonus: MotoboyPublico[];
  figurinhaBonusRecebida: MotoboyPublico | null;

  conquistasNovas: Conquista[];

  repetidasDisponiveis: number;
  trocaAberta: boolean;
  trocaRecebida: MotoboyPublico | null;
  trocarRepetidas: () => void;
  fecharTroca: () => void;
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
  const [conquistasNovas, setConquistasNovas] = useState<Conquista[]>([]);
  const [repetidasConsumidas, setRepetidasConsumidas] = useState<RepetidasConsumidas>({});
  const [trocaAberta, setTrocaAberta] = useState(false);
  const [trocaRecebida, setTrocaRecebida] = useState<MotoboyPublico | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setItens(storage.getCarrinho());
    setEnderecoIndice(storage.getEnderecoIndice());
    setPedidos(storage.getPedidos());
    setStreak(storage.getStreak());
    setFigurinhasBonus(storage.getFigurinhasBonus());
    setRepetidasConsumidas(storage.getRepetidasConsumidas());
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

  useEffect(() => {
    if (carregado) storage.setRepetidasConsumidas(repetidasConsumidas);
  }, [repetidasConsumidas, carregado]);

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

    const albumAntigo = calcularAlbum(pedidos, figurinhasBonus);
    const regioesAntigo = calcularRegioesColetadas(pedidos);
    const conquistasAntigas = calcularConquistas(
      pedidos,
      albumAntigo,
      motoboys.length,
      regioesAntigo,
      streak
    );

    const motoboy = sortearMotoboy(motoboys);
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

    const pedidosNovo = [...pedidos, pedido];
    setPedidos(pedidosNovo);
    storage.incrementarContadorDesejos();

    const streakAntigo = streak;
    const streakNovo = atualizarStreak(streakAntigo);
    setStreak(streakNovo);

    setFigurinhaBonusRecebida(null);
    let figurinhasBonusNovo = figurinhasBonus;
    if (ganhouBonusHoje(streakAntigo, streakNovo) && motoboys.length > 0) {
      const bonus = sortearMotoboy(motoboys);
      figurinhasBonusNovo = [...figurinhasBonus, bonus];
      setFigurinhasBonus(figurinhasBonusNovo);
      setFigurinhaBonusRecebida(bonus);
    }

    const albumNovo = calcularAlbum(pedidosNovo, figurinhasBonusNovo);
    const regioesNovo = calcularRegioesColetadas(pedidosNovo);
    const conquistasNovasCalc = calcularConquistas(
      pedidosNovo,
      albumNovo,
      motoboys.length,
      regioesNovo,
      streakNovo
    );
    const idsJaDesbloqueados = new Set(
      conquistasAntigas.filter((c) => c.desbloqueada).map((c) => c.id)
    );
    setConquistasNovas(
      conquistasNovasCalc.filter((c) => c.desbloqueada && !idsJaDesbloqueados.has(c.id))
    );

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

  function avaliarPedido(id: string, nota: number) {
    setPedidoAtual((atual) =>
      atual && atual.id === id ? { ...atual, avaliacao: nota } : atual
    );
    setPedidos((atual) => atual.map((p) => (p.id === id ? { ...p, avaliacao: nota } : p)));
  }

  const album = calcularAlbum(pedidos, figurinhasBonus);
  const repetidasDisponiveis = contarRepetidasDisponiveis(album, repetidasConsumidas);

  function trocarRepetidas() {
    if (!podeTrocar(album, repetidasConsumidas)) return;

    const sorteado = sortearTroca(motoboys);
    if (!sorteado) return;

    setRepetidasConsumidas((atual) => consumirRepetidas(album, atual));
    setFigurinhasBonus((atual) => [...atual, sorteado]);
    setTrocaRecebida(sorteado);
    setTrocaAberta(true);
  }

  function fecharTroca() {
    setTrocaAberta(false);
    setTrocaRecebida(null);
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
        avaliarPedido,

        entregaAberta,
        fecharEntrega,

        streak,
        figurinhasBonus,
        figurinhaBonusRecebida,

        conquistasNovas,

        repetidasDisponiveis,
        trocaAberta,
        trocaRecebida,
        trocarRepetidas,
        fecharTroca,
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
