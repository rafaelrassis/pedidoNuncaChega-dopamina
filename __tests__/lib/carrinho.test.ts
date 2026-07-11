import { describe, expect, it } from "vitest";
import {
  calcularEconomia,
  calcularImpostos,
  calcularSubtotal,
  calcularTaxaEntrega,
  calcularTotal,
  contarItens,
  formatarPreco,
  gerarChaveOpcoes,
  gerarIdPedido,
} from "@/lib/carrinho";
import { criarItemCarrinho } from "../fixtures";

const normalizar = (s: string) => s.replace(/ /g, " ");

describe("calcularSubtotal", () => {
  it("soma precoUnitario * quantidade de todos os itens", () => {
    const itens = [
      criarItemCarrinho({ precoUnitario: 10, quantidade: 2 }),
      criarItemCarrinho({ itemId: "item-2", precoUnitario: 5, quantidade: 3 }),
    ];
    expect(calcularSubtotal(itens)).toBe(35);
  });

  it("retorna 0 para carrinho vazio", () => {
    expect(calcularSubtotal([])).toBe(0);
  });
});

describe("calcularEconomia", () => {
  it("soma a diferença entre preço original e preço pago, por quantidade", () => {
    const itens = [
      criarItemCarrinho({ precoOriginalUnitario: 40, precoUnitario: 30, quantidade: 2 }),
    ];
    expect(calcularEconomia(itens)).toBe(20);
  });

  it("retorna 0 quando não há desconto", () => {
    const itens = [criarItemCarrinho({ precoOriginalUnitario: 30, precoUnitario: 30 })];
    expect(calcularEconomia(itens)).toBe(0);
  });
});

describe("calcularTaxaEntrega", () => {
  it("cobra 30% do subtotal", () => {
    expect(calcularTaxaEntrega(100)).toBe(30);
  });

  it("retorna 0 quando o subtotal é 0", () => {
    expect(calcularTaxaEntrega(0)).toBe(0);
  });
});

describe("calcularImpostos", () => {
  it("cobra 5% do subtotal", () => {
    expect(calcularImpostos(100)).toBe(5);
  });

  it("retorna 0 quando o subtotal é 0", () => {
    expect(calcularImpostos(0)).toBe(0);
  });
});

describe("calcularTotal", () => {
  it("soma subtotal + entrega (30%) + impostos (5%)", () => {
    const itens = [criarItemCarrinho({ precoUnitario: 100, quantidade: 1 })];
    // subtotal 100, entrega 30, impostos 5 => 135
    expect(calcularTotal(itens)).toBe(135);
  });

  it("retorna 0 para carrinho vazio", () => {
    expect(calcularTotal([])).toBe(0);
  });
});

describe("contarItens", () => {
  it("soma a quantidade de todos os itens", () => {
    const itens = [
      criarItemCarrinho({ quantidade: 2 }),
      criarItemCarrinho({ itemId: "item-2", quantidade: 3 }),
    ];
    expect(contarItens(itens)).toBe(5);
  });

  it("retorna 0 para carrinho vazio", () => {
    expect(contarItens([])).toBe(0);
  });
});

describe("formatarPreco", () => {
  it("formata em real brasileiro", () => {
    expect(normalizar(formatarPreco(30))).toBe("R$ 30,00");
    expect(normalizar(formatarPreco(1234.5))).toBe("R$ 1.234,50");
  });
});

describe("gerarChaveOpcoes", () => {
  it("gera a mesma chave para as mesmas opções em ordem diferente", () => {
    const chave1 = gerarChaveOpcoes([
      { grupo: "Porção", nome: "Grande", acrescimo: 10 },
      { grupo: "Adicional", nome: "Torresmo", acrescimo: 8 },
    ]);
    const chave2 = gerarChaveOpcoes([
      { grupo: "Adicional", nome: "Torresmo", acrescimo: 8 },
      { grupo: "Porção", nome: "Grande", acrescimo: 10 },
    ]);
    expect(chave1).toBe(chave2);
  });

  it("gera chaves diferentes para opções diferentes", () => {
    const chave1 = gerarChaveOpcoes([{ grupo: "Porção", nome: "Normal", acrescimo: 0 }]);
    const chave2 = gerarChaveOpcoes([{ grupo: "Porção", nome: "Grande", acrescimo: 10 }]);
    expect(chave1).not.toBe(chave2);
  });

  it("retorna string vazia para lista vazia", () => {
    expect(gerarChaveOpcoes([])).toBe("");
  });
});

describe("gerarIdPedido", () => {
  it("gera um id no formato PNC + 4 dígitos", () => {
    const id = gerarIdPedido();
    expect(id).toMatch(/^PNC\d{4}$/);
  });
});
