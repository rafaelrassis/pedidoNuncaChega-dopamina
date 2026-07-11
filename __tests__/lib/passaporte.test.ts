import { describe, expect, it } from "vitest";
import { calcularRegioesColetadas, TODAS_REGIOES } from "@/lib/passaporte";
import { criarItemCarrinho, criarPedido } from "../fixtures";

describe("calcularRegioesColetadas", () => {
  it("retorna vazio para lista de pedidos vazia", () => {
    const regioes = calcularRegioesColetadas([]);
    expect(regioes.size).toBe(0);
  });

  it("coleta a região de cada item pedido", () => {
    const regioes = calcularRegioesColetadas([
      criarPedido({ itens: [criarItemCarrinho({ regiao: "NORDESTE" })] }),
      criarPedido({ itens: [criarItemCarrinho({ regiao: "SUL" })] }),
    ]);
    expect(regioes.has("NORDESTE")).toBe(true);
    expect(regioes.has("SUL")).toBe(true);
    expect(regioes.size).toBe(2);
  });

  it("não duplica região repetida em pedidos diferentes", () => {
    const regioes = calcularRegioesColetadas([
      criarPedido({ itens: [criarItemCarrinho({ regiao: "SUDESTE" })] }),
      criarPedido({ itens: [criarItemCarrinho({ regiao: "SUDESTE" })] }),
    ]);
    expect(regioes.size).toBe(1);
  });

  it("considera passaporte completo quando todas as regiões foram coletadas", () => {
    const pedidos = TODAS_REGIOES.map((regiao, i) =>
      criarPedido({ id: `p${i}`, itens: [criarItemCarrinho({ regiao })] })
    );
    const regioes = calcularRegioesColetadas(pedidos);
    expect(regioes.size).toBe(TODAS_REGIOES.length);
  });

  it("um pedido com múltiplos itens de regiões diferentes conta todas", () => {
    const regioes = calcularRegioesColetadas([
      criarPedido({
        itens: [
          criarItemCarrinho({ itemId: "a", regiao: "NORTE" }),
          criarItemCarrinho({ itemId: "b", regiao: "CENTRO_OESTE" }),
        ],
      }),
    ]);
    expect(regioes.size).toBe(2);
  });
});
