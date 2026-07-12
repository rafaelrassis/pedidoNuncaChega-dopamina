import { describe, expect, it } from "vitest";
import { MENSAGENS_PRESET, sortearRespostaMotoboy } from "@/lib/chatMotoboy";
import { criarMotoboy } from "../fixtures";

describe("MENSAGENS_PRESET", () => {
  it("tem entre 3 e 4 mensagens preset", () => {
    expect(MENSAGENS_PRESET.length).toBeGreaterThanOrEqual(3);
    expect(MENSAGENS_PRESET.length).toBeLessThanOrEqual(4);
  });
});

describe("sortearRespostaMotoboy", () => {
  it("retorna a frase do motoboy quando o sorteio cai no início do pool", () => {
    const motoboy = criarMotoboy({ frase: "Sumiu no mapa, mas tá vindo" });
    expect(sortearRespostaMotoboy(motoboy, () => 0)).toBe("Sumiu no mapa, mas tá vindo");
  });

  it("retorna uma resposta genérica quando o sorteio cai no fim do pool", () => {
    const motoboy = criarMotoboy({ frase: "Sumiu no mapa, mas tá vindo" });
    const resposta = sortearRespostaMotoboy(motoboy, () => 0.99);
    expect(resposta).not.toBe(motoboy.frase);
    expect(resposta.length).toBeGreaterThan(0);
  });

  it("todas as respostas possíveis são strings não vazias", () => {
    const motoboy = criarMotoboy({ frase: "Tô voando de moto" });
    const amostras = 20;
    for (let i = 0; i < amostras; i++) {
      const resposta = sortearRespostaMotoboy(motoboy, () => i / amostras);
      expect(resposta.length).toBeGreaterThan(0);
    }
  });
});
