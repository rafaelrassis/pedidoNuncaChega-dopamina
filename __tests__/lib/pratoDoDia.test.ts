import { describe, expect, it } from "vitest";
import { escolherPratoDoDia } from "@/lib/pratoDoDia";

describe("escolherPratoDoDia", () => {
  const comidas = [
    { id: "a" },
    { id: "b" },
    { id: "c" },
    { id: "d" },
  ];

  it("retorna null quando não há comidas", () => {
    expect(escolherPratoDoDia([], "2026-07-10")).toBeNull();
  });

  it("é determinístico: mesma data sempre retorna a mesma comida", () => {
    const resultado1 = escolherPratoDoDia(comidas, "2026-07-10");
    const resultado2 = escolherPratoDoDia(comidas, "2026-07-10");
    expect(resultado1?.id).toBe(resultado2?.id);
  });

  it("varia entre datas diferentes", () => {
    const datas = Array.from({ length: 30 }, (_, i) => `2026-07-${String(i + 1).padStart(2, "0")}`);
    const resultados = new Set(datas.map((data) => escolherPratoDoDia(comidas, data)?.id));
    expect(resultados.size).toBeGreaterThan(1);
  });

  it("ignora comidas inativas", () => {
    const comComInativas = [
      { id: "ativa-1", ativo: true },
      { id: "inativa", ativo: false },
    ];
    for (let i = 0; i < 20; i++) {
      const resultado = escolherPratoDoDia(comComInativas, `2026-07-${String(i + 1).padStart(2, "0")}`);
      expect(resultado?.id).toBe("ativa-1");
    }
  });

  it("retorna null quando todas as comidas estão inativas", () => {
    const todasInativas = [{ id: "a", ativo: false }];
    expect(escolherPratoDoDia(todasInativas, "2026-07-10")).toBeNull();
  });
});
