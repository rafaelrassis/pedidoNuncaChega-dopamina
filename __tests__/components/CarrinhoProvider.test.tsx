import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { CarrinhoProvider, useCarrinho } from "@/components/CarrinhoProvider";
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
});
