import { describe, expect, it, vi } from "vitest";
import { atualizarStreak, detectarStreakQuebrado, ganhouBonusHoje } from "@/lib/streak";
import type { Streak } from "@/lib/tipos";

// Datas construídas com o construtor local (ano, mês 0-indexado, dia) pra
// bater exatamente com getFullYear/getMonth/getDate usados em lib/streak.ts.
const DIA_10 = new Date(2026, 6, 10);
const DIA_11 = new Date(2026, 6, 11);
const DIA_13 = new Date(2026, 6, 13);

describe("atualizarStreak", () => {
  it("não incrementa quando já pediu hoje", () => {
    const atual: Streak = { dias: 3, ultimaData: "2026-07-10" };
    const novo = atualizarStreak(atual, new Date(2026, 6, 10, 23, 0));
    expect(novo).toEqual({ dias: 3, ultimaData: "2026-07-10" });
  });

  it("incrementa quando pede no dia seguinte", () => {
    const atual: Streak = { dias: 3, ultimaData: "2026-07-10" };
    const novo = atualizarStreak(atual, DIA_11);
    expect(novo).toEqual({ dias: 4, ultimaData: "2026-07-11" });
  });

  it("reseta pra 1 quando pula um dia", () => {
    const atual: Streak = { dias: 5, ultimaData: "2026-07-10" };
    const novo = atualizarStreak(atual, DIA_13);
    expect(novo).toEqual({ dias: 1, ultimaData: "2026-07-13" });
  });

  it("começa em 1 no primeiro pedido (sem ultimaData)", () => {
    const atual: Streak = { dias: 0, ultimaData: null };
    const novo = atualizarStreak(atual, DIA_10);
    expect(novo).toEqual({ dias: 1, ultimaData: "2026-07-10" });
  });

  it("usa a data do sistema quando 'agora' não é passado", () => {
    vi.useFakeTimers();
    vi.setSystemTime(DIA_10);
    const atual: Streak = { dias: 0, ultimaData: null };
    const novo = atualizarStreak(atual);
    expect(novo).toEqual({ dias: 1, ultimaData: "2026-07-10" });
    vi.useRealTimers();
  });
});

describe("ganhouBonusHoje", () => {
  it("true na virada exata dos 7 dias", () => {
    expect(ganhouBonusHoje({ dias: 6, ultimaData: "x" }, { dias: 7, ultimaData: "y" })).toBe(
      true
    );
  });

  it("true de novo na virada dos 14 dias", () => {
    expect(ganhouBonusHoje({ dias: 13, ultimaData: "x" }, { dias: 14, ultimaData: "y" })).toBe(
      true
    );
  });

  it("false quando o streak não mudou (mesmo dia)", () => {
    expect(ganhouBonusHoje({ dias: 7, ultimaData: "x" }, { dias: 7, ultimaData: "x" })).toBe(
      false
    );
  });

  it("false quando incrementa mas não é múltiplo de 7", () => {
    expect(ganhouBonusHoje({ dias: 5, ultimaData: "x" }, { dias: 6, ultimaData: "y" })).toBe(
      false
    );
  });

  it("false quando reseta pra 1 (não é múltiplo de 7)", () => {
    expect(ganhouBonusHoje({ dias: 8, ultimaData: "x" }, { dias: 1, ultimaData: "y" })).toBe(
      false
    );
  });
});

describe("detectarStreakQuebrado", () => {
  it("retorna o streak antigo quando quebra com 3+ dias", () => {
    const antigo = { dias: 5, ultimaData: "2026-07-10" };
    const novo = { dias: 1, ultimaData: "2026-07-13" };
    expect(detectarStreakQuebrado(antigo, novo)).toBe(5);
  });

  it("retorna null quando o streak antigo era menor que 3", () => {
    const antigo = { dias: 2, ultimaData: "2026-07-10" };
    const novo = { dias: 1, ultimaData: "2026-07-13" };
    expect(detectarStreakQuebrado(antigo, novo)).toBeNull();
  });

  it("retorna null no primeiro pedido de todos (sem streak antigo)", () => {
    const antigo = { dias: 0, ultimaData: null };
    const novo = { dias: 1, ultimaData: "2026-07-10" };
    expect(detectarStreakQuebrado(antigo, novo)).toBeNull();
  });

  it("retorna null quando o streak continua normalmente", () => {
    const antigo = { dias: 5, ultimaData: "2026-07-10" };
    const novo = { dias: 6, ultimaData: "2026-07-11" };
    expect(detectarStreakQuebrado(antigo, novo)).toBeNull();
  });

  it("retorna null quando pede de novo no mesmo dia (streak inalterado)", () => {
    const antigo = { dias: 5, ultimaData: "2026-07-10" };
    expect(detectarStreakQuebrado(antigo, antigo)).toBeNull();
  });
});
