import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { CarrinhoProvider, useCarrinho } from "@/components/CarrinhoProvider";
import { storage } from "@/lib/storage";
import { criarMotoboy } from "../fixtures";

function mockFetchMotoboys(motoboys = [criarMotoboy()]) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(motoboys),
    })
  );
}

const itemBase = {
  comidaId: "comida-1",
  nome: "Feijoada",
  slug: "feijoada",
  fotoUrl: "/img/feijoada.jpg",
  regiao: "SUDESTE" as const,
  precoUnitario: 30,
  precoOriginalUnitario: 40,
  quantidade: 1,
  opcoes: [],
};

beforeEach(() => {
  window.localStorage.clear();
  mockFetchMotoboys();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("CarrinhoProvider", () => {
  it("adiciona um item novo ao carrinho", async () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    await waitFor(() => expect(result.current.motoboys.length).toBeGreaterThan(0));

    act(() => result.current.adicionarItem(itemBase));

    expect(result.current.itens).toHaveLength(1);
    expect(result.current.itens[0].nome).toBe("Feijoada");
    expect(result.current.itens[0].quantidade).toBe(1);
  });

  it("agrupa quantidade quando adiciona item com as mesmas opções", () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });

    act(() => result.current.adicionarItem(itemBase));
    act(() => result.current.adicionarItem({ ...itemBase, quantidade: 2 }));

    expect(result.current.itens).toHaveLength(1);
    expect(result.current.itens[0].quantidade).toBe(3);
  });

  it("cria item separado quando as opções são diferentes", () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });

    act(() => result.current.adicionarItem(itemBase));
    act(() =>
      result.current.adicionarItem({
        ...itemBase,
        opcoes: [{ grupo: "Porção", nome: "Grande", acrescimo: 10 }],
      })
    );

    expect(result.current.itens).toHaveLength(2);
  });

  it("atualizarQuantidade para 0 remove o item", () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });

    act(() => result.current.adicionarItem(itemBase));
    const itemId = result.current.itens[0].itemId;

    act(() => result.current.atualizarQuantidade(itemId, 0));

    expect(result.current.itens).toHaveLength(0);
  });

  it("criarPedido com carrinho vazio retorna null", () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });

    let pedido;
    act(() => {
      pedido = result.current.criarPedido();
    });

    expect(pedido).toBeNull();
    expect(result.current.pedidos).toHaveLength(0);
  });

  it("criarPedido limpa o carrinho, salva o pedido e abre o tracking", async () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    await waitFor(() => expect(result.current.motoboys.length).toBeGreaterThan(0));

    act(() => result.current.adicionarItem(itemBase));

    let pedido;
    act(() => {
      pedido = result.current.criarPedido();
    });

    expect(pedido).not.toBeNull();
    expect(result.current.itens).toHaveLength(0);
    expect(result.current.pedidos).toHaveLength(1);
    expect(result.current.trackingAberto).toBe(true);
    expect(result.current.checkoutAberto).toBe(false);
    expect(result.current.pedidoAtual?.id).toBe(pedido!.id);
  });

  it("detecta streak quebrado quando pede após pular vários dias", async () => {
    const dataAntiga = new Date();
    dataAntiga.setDate(dataAntiga.getDate() - 5);
    const anoMesDia = `${dataAntiga.getFullYear()}-${String(dataAntiga.getMonth() + 1).padStart(2, "0")}-${String(dataAntiga.getDate()).padStart(2, "0")}`;
    storage.setStreak({ dias: 5, ultimaData: anoMesDia });

    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    await waitFor(() => expect(result.current.streak.dias).toBe(5));

    act(() => result.current.adicionarItem(itemBase));
    act(() => {
      result.current.criarPedido();
    });

    expect(result.current.streak.dias).toBe(1);
    expect(result.current.streakQuebrado).toBe(5);

    act(() => result.current.fecharStreakQuebrado());
    expect(result.current.streakQuebrado).toBeNull();
  });

  it("não sinaliza streak quebrado no primeiro pedido de todos", async () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    await waitFor(() => expect(result.current.motoboys.length).toBeGreaterThan(0));

    act(() => result.current.adicionarItem(itemBase));
    act(() => {
      result.current.criarPedido();
    });

    expect(result.current.streakQuebrado).toBeNull();
  });

  it("avaliarPedido grava a nota no pedido atual e na lista de pedidos", async () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    await waitFor(() => expect(result.current.motoboys.length).toBeGreaterThan(0));

    act(() => result.current.adicionarItem(itemBase));
    let pedido;
    act(() => {
      pedido = result.current.criarPedido();
    });

    act(() => result.current.avaliarPedido(pedido!.id, 5));

    expect(result.current.pedidoAtual?.avaliacao).toBe(5);
    expect(result.current.pedidos[0].avaliacao).toBe(5);
  });

  it("trocarRepetidas troca 5 repetidas por uma figurinha garantida raro/lendária", async () => {
    const comum = criarMotoboy({ id: "comum", raridade: "COMUM", pesoSorteio: 10 });
    const raro = criarMotoboy({ id: "raro", raridade: "RARO", pesoSorteio: 1 });
    mockFetchMotoboys([comum, raro]);

    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    await waitFor(() => expect(result.current.motoboys.length).toBe(2));

    const randomOriginal = Math.random;
    vi.spyOn(Math, "random").mockReturnValue(0);
    for (let i = 0; i < 6; i++) {
      act(() => result.current.adicionarItem(itemBase));
      act(() => {
        result.current.criarPedido();
      });
    }
    Math.random = randomOriginal;

    expect(result.current.repetidasDisponiveis).toBe(5);

    act(() => result.current.trocarRepetidas());

    expect(result.current.repetidasDisponiveis).toBe(0);
    expect(result.current.trocaAberta).toBe(true);
    expect(result.current.trocaRecebida?.id).toBe("raro");
    expect(result.current.figurinhasBonus.map((f) => f.id)).toContain("raro");

    act(() => result.current.fecharTroca());
    expect(result.current.trocaAberta).toBe(false);
  });

  it("trocarRepetidas não faz nada com menos de 5 repetidas disponíveis", async () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper: CarrinhoProvider });
    await waitFor(() => expect(result.current.motoboys.length).toBeGreaterThan(0));

    act(() => result.current.trocarRepetidas());

    expect(result.current.trocaAberta).toBe(false);
    expect(result.current.trocaRecebida).toBeNull();
  });
});
