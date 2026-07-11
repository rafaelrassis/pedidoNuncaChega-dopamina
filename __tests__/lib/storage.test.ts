import { beforeEach, describe, expect, it } from "vitest";
import { storage } from "@/lib/storage";
import { criarPedido } from "../fixtures";

beforeEach(() => {
  window.localStorage.clear();
});

describe("storage", () => {
  it("retorna o valor padrão quando o JSON salvo está corrompido", () => {
    window.localStorage.setItem("pnc:pedidos", "{ isso não é json válido");
    expect(storage.getPedidos()).toEqual([]);
  });

  it("não lança quando o JSON está corrompido", () => {
    window.localStorage.setItem("pnc:carrinho", "]][[]");
    expect(() => storage.getCarrinho()).not.toThrow();
  });

  it("round-trip: setPedidos seguido de getPedidos retorna os mesmos dados", () => {
    const pedido = criarPedido();
    storage.setPedidos([pedido]);
    expect(storage.getPedidos()).toEqual([pedido]);
  });

  it("round-trip do carrinho", () => {
    storage.setEnderecoIndice(2);
    expect(storage.getEnderecoIndice()).toBe(2);
  });

  it("getStreak retorna o padrão quando nunca foi salvo", () => {
    expect(storage.getStreak()).toEqual({ dias: 0, ultimaData: null });
  });

  it("getContadorDesejos gera valor inicial entre 40.000 e 60.000", () => {
    const valor = storage.getContadorDesejos();
    expect(valor).toBeGreaterThanOrEqual(40000);
    expect(valor).toBeLessThan(60000);
  });

  it("getContadorDesejos retorna o mesmo valor em chamadas seguintes", () => {
    const primeiro = storage.getContadorDesejos();
    const segundo = storage.getContadorDesejos();
    expect(segundo).toBe(primeiro);
  });

  it("incrementarContadorDesejos soma 1 ao valor atual", () => {
    const inicial = storage.getContadorDesejos();
    const incrementado = storage.incrementarContadorDesejos();
    expect(incrementado).toBe(inicial + 1);
    expect(storage.getContadorDesejos()).toBe(inicial + 1);
  });
});
