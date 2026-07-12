import { describe, expect, it } from "vitest";
import {
  aplicarEventoAoTempo,
  POOL_EVENTOS_ALEATORIOS,
  sortearEventoAleatorio,
  TEMPO_MINIMO_SEGUNDOS,
} from "@/lib/eventosTracking";

describe("sortearEventoAleatorio", () => {
  it("escolhe o primeiro evento quando o rng retorna 0", () => {
    const evento = sortearEventoAleatorio(() => 0);
    expect(evento).toBe(POOL_EVENTOS_ALEATORIOS[0]);
  });

  it("escolhe o último evento quando o rng retorna perto de 1", () => {
    const evento = sortearEventoAleatorio(() => 0.9999999);
    expect(evento).toBe(POOL_EVENTOS_ALEATORIOS[POOL_EVENTOS_ALEATORIOS.length - 1]);
  });

  it("percorre todo o pool conforme o rng varia (pesos iguais)", () => {
    const total = POOL_EVENTOS_ALEATORIOS.length;
    const escolhidos = POOL_EVENTOS_ALEATORIOS.map((_, i) =>
      sortearEventoAleatorio(() => i / total).id
    );
    expect(escolhidos).toEqual(POOL_EVENTOS_ALEATORIOS.map((e) => e.id));
  });

  it("usa Math.random por padrão quando nenhum rng é passado", () => {
    const evento = sortearEventoAleatorio();
    expect(POOL_EVENTOS_ALEATORIOS.map((e) => e.id)).toContain(evento.id);
  });
});

describe("aplicarEventoAoTempo", () => {
  it("soma um delta positivo normalmente ao restante e ao total", () => {
    const resultado = aplicarEventoAoTempo(100, 180, 40);
    expect(resultado).toEqual({ segundosRestantes: 140, duracaoTotal: 220 });
  });

  it("subtrai um delta negativo normalmente quando não estoura o mínimo", () => {
    const resultado = aplicarEventoAoTempo(100, 180, -20);
    expect(resultado).toEqual({ segundosRestantes: 80, duracaoTotal: 160 });
  });

  it("nunca deixa o tempo restante abaixo do mínimo (15s)", () => {
    const resultado = aplicarEventoAoTempo(20, 180, -30);
    expect(resultado.segundosRestantes).toBe(TEMPO_MINIMO_SEGUNDOS);
  });

  it("ajusta o total proporcionalmente ao delta efetivo aplicado (clamp)", () => {
    // pedia -30, mas só pôde cair 5 (de 20 pra 15) -> total também cai só 5
    const resultado = aplicarEventoAoTempo(20, 180, -30);
    expect(resultado).toEqual({ segundosRestantes: 15, duracaoTotal: 175 });
  });

  it("delta 0 não altera nada", () => {
    const resultado = aplicarEventoAoTempo(50, 180, 0);
    expect(resultado).toEqual({ segundosRestantes: 50, duracaoTotal: 180 });
  });

  it("já no mínimo com delta negativo permanece no mínimo sem alterar o total", () => {
    const resultado = aplicarEventoAoTempo(TEMPO_MINIMO_SEGUNDOS, 180, -20);
    expect(resultado).toEqual({ segundosRestantes: TEMPO_MINIMO_SEGUNDOS, duracaoTotal: 180 });
  });
});
