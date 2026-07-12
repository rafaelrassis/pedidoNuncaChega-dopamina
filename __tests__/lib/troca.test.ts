import { afterEach, describe, expect, it, vi } from "vitest";
import {
  REPETIDAS_POR_TROCA,
  consumirRepetidas,
  contarRepetidasDisponiveis,
  podeTrocar,
  sortearTroca,
} from "@/lib/troca";
import { calcularAlbum } from "@/lib/album";
import { criarMotoboy, criarPedido } from "../fixtures";

describe("contarRepetidasDisponiveis", () => {
  it("retorna 0 quando o álbum está vazio", () => {
    const album = calcularAlbum([]);
    expect(contarRepetidasDisponiveis(album, {})).toBe(0);
  });

  it("ignora a primeira cópia de cada motoboy (não é repetida)", () => {
    const album = calcularAlbum([
      criarPedido({ id: "p1", motoboy: criarMotoboy({ id: "a" }) }),
      criarPedido({ id: "p2", motoboy: criarMotoboy({ id: "b" }) }),
    ]);
    expect(contarRepetidasDisponiveis(album, {})).toBe(0);
  });

  it("soma quantidade-1 de cada motoboy repetido", () => {
    const album = calcularAlbum([
      criarPedido({ id: "p1", motoboy: criarMotoboy({ id: "a" }) }),
      criarPedido({ id: "p2", motoboy: criarMotoboy({ id: "a" }) }),
      criarPedido({ id: "p3", motoboy: criarMotoboy({ id: "a" }) }),
      criarPedido({ id: "p4", motoboy: criarMotoboy({ id: "b" }) }),
      criarPedido({ id: "p5", motoboy: criarMotoboy({ id: "b" }) }),
    ]);
    // "a": 3 cópias -> 2 repetidas; "b": 2 cópias -> 1 repetida
    expect(contarRepetidasDisponiveis(album, {})).toBe(3);
  });

  it("desconta repetidas já consumidas", () => {
    const album = calcularAlbum([
      criarPedido({ id: "p1", motoboy: criarMotoboy({ id: "a" }) }),
      criarPedido({ id: "p2", motoboy: criarMotoboy({ id: "a" }) }),
      criarPedido({ id: "p3", motoboy: criarMotoboy({ id: "a" }) }),
    ]);
    expect(contarRepetidasDisponiveis(album, { a: 1 })).toBe(1);
    expect(contarRepetidasDisponiveis(album, { a: 2 })).toBe(0);
  });
});

describe("podeTrocar", () => {
  it("é falso com menos de 5 repetidas disponíveis", () => {
    const album = calcularAlbum([
      criarPedido({ id: "p1", motoboy: criarMotoboy({ id: "a" }) }),
      criarPedido({ id: "p2", motoboy: criarMotoboy({ id: "a" }) }),
    ]);
    expect(podeTrocar(album, {})).toBe(false);
  });

  it("é verdadeiro com 5 ou mais repetidas disponíveis", () => {
    const pedidos = Array.from({ length: 6 }, (_, i) =>
      criarPedido({ id: `p${i}`, motoboy: criarMotoboy({ id: "a" }) })
    );
    const album = calcularAlbum(pedidos);
    expect(contarRepetidasDisponiveis(album, {})).toBe(5);
    expect(podeTrocar(album, {})).toBe(true);
  });
});

describe("consumirRepetidas", () => {
  it("consome repetidas de um único motoboy quando suficiente", () => {
    const pedidos = Array.from({ length: 6 }, (_, i) =>
      criarPedido({ id: `p${i}`, motoboy: criarMotoboy({ id: "a" }) })
    );
    const album = calcularAlbum(pedidos);
    const resultado = consumirRepetidas(album, {}, REPETIDAS_POR_TROCA);
    expect(resultado).toEqual({ a: 5 });
  });

  it("consome repetidas de múltiplos motoboys quando necessário", () => {
    const album = calcularAlbum([
      criarPedido({ id: "p1", motoboy: criarMotoboy({ id: "a" }) }),
      criarPedido({ id: "p2", motoboy: criarMotoboy({ id: "a" }) }),
      criarPedido({ id: "p3", motoboy: criarMotoboy({ id: "a" }) }),
      criarPedido({ id: "p4", motoboy: criarMotoboy({ id: "b" }) }),
      criarPedido({ id: "p5", motoboy: criarMotoboy({ id: "b" }) }),
      criarPedido({ id: "p6", motoboy: criarMotoboy({ id: "b" }) }),
    ]);
    // "a": 2 repetidas disponíveis, "b": 2 repetidas disponíveis -> precisa de 5, só há 4
    const resultado = consumirRepetidas(album, {}, 4);
    expect(resultado).toEqual({ a: 2, b: 2 });
  });

  it("preserva consumo anterior ao consumir mais", () => {
    const pedidos = Array.from({ length: 6 }, (_, i) =>
      criarPedido({ id: `p${i}`, motoboy: criarMotoboy({ id: "a" }) })
    );
    const album = calcularAlbum(pedidos);
    const resultado = consumirRepetidas(album, { a: 2 }, 3);
    expect(resultado).toEqual({ a: 5 });
  });
});

describe("sortearTroca", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna null quando não há motoboys raros ou lendários", () => {
    const comum = criarMotoboy({ id: "comum", raridade: "COMUM" });
    expect(sortearTroca([comum])).toBeNull();
  });

  it("ignora motoboys comuns e só sorteia entre raro e lendário", () => {
    const comum = criarMotoboy({ id: "comum", raridade: "COMUM", pesoSorteio: 100 });
    const raro = criarMotoboy({ id: "raro", raridade: "RARO", pesoSorteio: 1 });
    const resultado = sortearTroca([comum, raro], () => 0.5);
    expect(resultado?.id).toBe("raro");
  });

  it("respeita o pesoSorteio relativo entre raro e lendário", () => {
    const raro = criarMotoboy({ id: "raro", raridade: "RARO", pesoSorteio: 9 });
    const lendario = criarMotoboy({ id: "lendario", raridade: "LENDARIO", pesoSorteio: 1 });
    expect(sortearTroca([raro, lendario], () => 0)?.id).toBe("raro");
    expect(sortearTroca([raro, lendario], () => 0.99)?.id).toBe("lendario");
  });
});
