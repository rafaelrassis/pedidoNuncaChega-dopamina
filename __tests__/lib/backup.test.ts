import { beforeEach, describe, expect, it } from "vitest";
import { exportarProgresso, importarProgresso } from "@/lib/backup";
import { storage } from "@/lib/storage";
import { criarPedido } from "../fixtures";

beforeEach(() => {
  window.localStorage.clear();
});

describe("exportarProgresso / importarProgresso", () => {
  it("round-trip: exportar e depois importar restaura o mesmo progresso", () => {
    const pedido = criarPedido();
    storage.setPedidos([pedido]);
    storage.setStreak({ dias: 3, ultimaData: "2026-07-10" });
    storage.setEnderecoIndice(1);
    storage.setContadorDesejos(45000);
    storage.setRepetidasConsumidas({ "motoboy-1": 2 });

    const json = exportarProgresso();

    window.localStorage.clear();
    expect(storage.getPedidos()).toEqual([]);

    const resultado = importarProgresso(json);

    expect(resultado.sucesso).toBe(true);
    expect(storage.getPedidos()).toEqual([pedido]);
    expect(storage.getStreak()).toEqual({ dias: 3, ultimaData: "2026-07-10" });
    expect(storage.getEnderecoIndice()).toBe(1);
    expect(storage.getContadorDesejos()).toBe(45000);
    expect(storage.getRepetidasConsumidas()).toEqual({ "motoboy-1": 2 });
  });

  it("importa backup antigo sem repetidasConsumidas assumindo objeto vazio", () => {
    const backupAntigo = {
      versao: 1,
      pedidos: [],
      streak: { dias: 0, ultimaData: null },
      figurinhasBonus: [],
      carrinho: [],
      enderecoIndice: 0,
      contadorDesejos: 40000,
    };

    const resultado = importarProgresso(JSON.stringify(backupAntigo));

    expect(resultado.sucesso).toBe(true);
    expect(storage.getRepetidasConsumidas()).toEqual({});
  });

  it("importar JSON corrompido não altera o storage e retorna erro", () => {
    storage.setPedidos([criarPedido()]);

    const resultado = importarProgresso("{ isso não é json válido");

    expect(resultado.sucesso).toBe(false);
    if (!resultado.sucesso) {
      expect(resultado.erro).toMatch(/não é um JSON válido/i);
    }
    expect(storage.getPedidos()).toHaveLength(1);
  });

  it("rejeita backup com versão desconhecida sem alterar o storage", () => {
    storage.setPedidos([criarPedido()]);

    const resultado = importarProgresso(JSON.stringify({ versao: 99, pedidos: [] }));

    expect(resultado.sucesso).toBe(false);
    expect(storage.getPedidos()).toHaveLength(1);
  });

  it("rejeita backup com estrutura inválida (campo faltando)", () => {
    const resultado = importarProgresso(JSON.stringify({ versao: 1, pedidos: "não é array" }));
    expect(resultado.sucesso).toBe(false);
  });

  it("exporta com a versão atual", () => {
    const json = exportarProgresso();
    const dados = JSON.parse(json);
    expect(dados.versao).toBe(1);
  });
});
