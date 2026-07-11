import { describe, expect, it } from "vitest";
import type { Regiao } from "@prisma/client";
import { calcularConquistas } from "@/lib/conquistas";
import { calcularAlbum } from "@/lib/album";
import { TODAS_REGIOES } from "@/lib/passaporte";
import { criarItemCarrinho, criarMotoboy, criarPedido } from "../fixtures";
import type { Streak } from "@/lib/tipos";

const STREAK_ZERO: Streak = { dias: 0, ultimaData: null };

function idsDesbloqueadas(
  pedidos: Parameters<typeof calcularConquistas>[0],
  totalMotoboys = 12,
  regioes: Set<Regiao> = new Set(),
  streak = STREAK_ZERO,
  bonus: Parameters<typeof calcularAlbum>[1] = []
) {
  const album = calcularAlbum(pedidos, bonus);
  return calcularConquistas(pedidos, album, totalMotoboys, regioes, streak)
    .filter((c) => c.desbloqueada)
    .map((c) => c.id);
}

describe("calcularConquistas", () => {
  it("nenhuma conquista desbloqueada sem pedidos", () => {
    expect(idsDesbloqueadas([])).toEqual([]);
  });

  it("primeiro-pedido desbloqueia com 1 pedido", () => {
    expect(idsDesbloqueadas([criarPedido()])).toContain("primeiro-pedido");
  });

  it("cliente-fiel desbloqueia com 10 pedidos", () => {
    const pedidos = Array.from({ length: 10 }, (_, i) => criarPedido({ id: `p${i}` }));
    const ids = idsDesbloqueadas(pedidos);
    expect(ids).toContain("cliente-fiel");
    expect(ids).not.toContain("viciado");
  });

  it("viciado desbloqueia com 50 pedidos", () => {
    const pedidos = Array.from({ length: 50 }, (_, i) => criarPedido({ id: `p${i}` }));
    expect(idsDesbloqueadas(pedidos)).toContain("viciado");
  });

  it("coruja desbloqueia com pedido entre 00h e 05h (horário local)", () => {
    const meiaNoite = new Date(2026, 6, 10, 2, 30);
    const pedidoNoturno = criarPedido({ criadoEm: meiaNoite.toISOString() });
    expect(idsDesbloqueadas([pedidoNoturno])).toContain("coruja");
  });

  it("coruja não desbloqueia com pedido às 12h", () => {
    const meioDia = new Date(2026, 6, 10, 12, 0);
    const pedidoDiurno = criarPedido({ criadoEm: meioDia.toISOString() });
    expect(idsDesbloqueadas([pedidoDiurno])).not.toContain("coruja");
  });

  it("sempre-o-mesmo desbloqueia com 3 pedidos do mesmo prato", () => {
    const pedidos = [
      criarPedido({ id: "p1", itens: [criarItemCarrinho({ comidaId: "feijoada" })] }),
      criarPedido({ id: "p2", itens: [criarItemCarrinho({ comidaId: "feijoada" })] }),
      criarPedido({ id: "p3", itens: [criarItemCarrinho({ comidaId: "feijoada" })] }),
    ];
    expect(idsDesbloqueadas(pedidos)).toContain("sempre-o-mesmo");
  });

  it("sempre-o-mesmo não desbloqueia com apenas 2 pedidos do mesmo prato", () => {
    const pedidos = [
      criarPedido({ id: "p1", itens: [criarItemCarrinho({ comidaId: "feijoada" })] }),
      criarPedido({ id: "p2", itens: [criarItemCarrinho({ comidaId: "feijoada" })] }),
    ];
    expect(idsDesbloqueadas(pedidos)).not.toContain("sempre-o-mesmo");
  });

  it("sempre-o-mesmo não conta duas unidades do mesmo prato num único pedido como dois pedidos", () => {
    const pedidoDuplo = criarPedido({
      itens: [
        criarItemCarrinho({ itemId: "a", comidaId: "feijoada", quantidade: 5 }),
      ],
    });
    expect(idsDesbloqueadas([pedidoDuplo])).not.toContain("sempre-o-mesmo");
  });

  it("colecionador desbloqueia quando o álbum tem todos os motoboys do catálogo", () => {
    const motoboy = criarMotoboy({ id: "unico" });
    const ids = idsDesbloqueadas([criarPedido({ motoboy })], 1);
    expect(ids).toContain("colecionador");
  });

  it("colecionador não desbloqueia com álbum incompleto", () => {
    const motoboy = criarMotoboy({ id: "unico" });
    const ids = idsDesbloqueadas([criarPedido({ motoboy })], 12);
    expect(ids).not.toContain("colecionador");
  });

  it("mochileiro desbloqueia com passaporte completo (5 regiões)", () => {
    const regioes = new Set(TODAS_REGIOES);
    expect(idsDesbloqueadas([criarPedido()], 12, regioes)).toContain("mochileiro");
  });

  it("mochileiro não desbloqueia com passaporte incompleto", () => {
    const regioes = new Set(TODAS_REGIOES.slice(0, 3));
    expect(idsDesbloqueadas([criarPedido()], 12, regioes)).not.toContain("mochileiro");
  });

  it("em-chamas desbloqueia com streak de 7 dias", () => {
    const streak: Streak = { dias: 7, ultimaData: "2026-07-10" };
    expect(idsDesbloqueadas([criarPedido()], 12, new Set(), streak)).toContain("em-chamas");
  });

  it("em-chamas não desbloqueia com streak abaixo de 7 dias", () => {
    const streak: Streak = { dias: 6, ultimaData: "2026-07-10" };
    expect(idsDesbloqueadas([criarPedido()], 12, new Set(), streak)).not.toContain("em-chamas");
  });

  it("sortudo desbloqueia ao tirar um motoboy lendário", () => {
    const lendario = criarMotoboy({ id: "lendario", raridade: "LENDARIO" });
    expect(idsDesbloqueadas([criarPedido({ motoboy: lendario })])).toContain("sortudo");
  });

  it("sortudo não desbloqueia com apenas motoboys comuns/raros", () => {
    const raro = criarMotoboy({ id: "raro", raridade: "RARO" });
    expect(idsDesbloqueadas([criarPedido({ motoboy: raro })])).not.toContain("sortudo");
  });

  it("sortudo desbloqueia com motoboy lendário vindo de figurinha bônus", () => {
    const comum = criarMotoboy({ id: "comum" });
    const lendarioBonus = criarMotoboy({ id: "lendario-bonus", raridade: "LENDARIO" });
    const ids = idsDesbloqueadas(
      [criarPedido({ motoboy: comum })],
      12,
      new Set(),
      STREAK_ZERO,
      [lendarioBonus]
    );
    expect(ids).toContain("sortudo");
  });
});
