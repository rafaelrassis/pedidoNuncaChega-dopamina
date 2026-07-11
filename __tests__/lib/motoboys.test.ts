import { afterEach, describe, expect, it, vi } from "vitest";
import { MOTOBOY_PADRAO, sortearMotoboy } from "@/lib/motoboys";
import { criarMotoboy } from "../fixtures";

describe("sortearMotoboy", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna MOTOBOY_PADRAO quando a lista está vazia", () => {
    expect(sortearMotoboy([])).toEqual(MOTOBOY_PADRAO);
  });

  it("respeita o pesoSorteio ao escolher o motoboy (alvo baixo escolhe o primeiro)", () => {
    const comum = criarMotoboy({ id: "comum", pesoSorteio: 10 });
    const raro = criarMotoboy({ id: "raro", pesoSorteio: 3 });
    // Math.random() * 13 = 0.05 * 13 = 0.65 -> cai dentro do peso do "comum" (0..10)
    vi.spyOn(Math, "random").mockReturnValue(0.05);
    expect(sortearMotoboy([comum, raro]).id).toBe("comum");
  });

  it("sorteia o último grupo de peso quando o alvo cai no fim da faixa", () => {
    const comum = criarMotoboy({ id: "comum", pesoSorteio: 10 });
    const raro = criarMotoboy({ id: "raro", pesoSorteio: 3 });
    // Math.random() * 13 perto de 13 -> cai na faixa do "raro" (10..13)
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    expect(sortearMotoboy([comum, raro]).id).toBe("raro");
  });

  it("distribuição aproximada respeita o peso relativo", () => {
    const comum = criarMotoboy({ id: "comum", pesoSorteio: 9 });
    const raro = criarMotoboy({ id: "raro", pesoSorteio: 1 });
    let sorteiosComum = 0;
    const amostras = 1000;
    const randomOriginal = Math.random;
    let i = 0;
    vi.spyOn(Math, "random").mockImplementation(() => {
      // sequência determinística cobrindo uniformemente [0, 1)
      i += 1;
      return (i % amostras) / amostras;
    });
    for (let n = 0; n < amostras; n++) {
      if (sortearMotoboy([comum, raro]).id === "comum") sorteiosComum += 1;
    }
    Math.random = randomOriginal;
    // peso 9:1 => ~90% dos sorteios devem ser "comum"
    expect(sorteiosComum / amostras).toBeGreaterThan(0.85);
    expect(sorteiosComum / amostras).toBeLessThan(0.95);
  });
});
