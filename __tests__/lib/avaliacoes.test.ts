import { describe, expect, it } from "vitest";
import { textoAvaliacao } from "@/lib/avaliacoes";

describe("textoAvaliacao", () => {
  it("retorna um texto diferente pra cada nota de 1 a 5", () => {
    const textos = [1, 2, 3, 4, 5].map(textoAvaliacao);
    expect(new Set(textos).size).toBe(5);
  });

  it("retorna string não vazia pra cada nota válida", () => {
    for (let nota = 1; nota <= 5; nota++) {
      expect(textoAvaliacao(nota).length).toBeGreaterThan(0);
    }
  });

  it("tem um texto de fallback pra nota fora do intervalo", () => {
    expect(textoAvaliacao(0).length).toBeGreaterThan(0);
    expect(textoAvaliacao(99).length).toBeGreaterThan(0);
  });
});
