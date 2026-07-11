import { describe, expect, it } from "vitest";
import { calcularAlbum } from "@/lib/album";
import { criarMotoboy, criarPedido } from "../fixtures";

describe("calcularAlbum", () => {
  it("retorna álbum vazio para pedidos vazios e sem bônus", () => {
    const album = calcularAlbum([]);
    expect(album.size).toBe(0);
  });

  it("conta um motoboy distinto por pedido", () => {
    const jailson = criarMotoboy({ id: "jailson" });
    const cida = criarMotoboy({ id: "cida", nome: "Dona Cida da Kombi" });
    const album = calcularAlbum([
      criarPedido({ id: "p1", motoboy: jailson }),
      criarPedido({ id: "p2", motoboy: cida }),
    ]);
    expect(album.size).toBe(2);
    expect(album.get("jailson")?.quantidade).toBe(1);
    expect(album.get("cida")?.quantidade).toBe(1);
  });

  it("incrementa a quantidade quando o mesmo motoboy se repete", () => {
    const jailson = criarMotoboy({ id: "jailson" });
    const album = calcularAlbum([
      criarPedido({ id: "p1", motoboy: jailson }),
      criarPedido({ id: "p2", motoboy: jailson }),
      criarPedido({ id: "p3", motoboy: jailson }),
    ]);
    expect(album.size).toBe(1);
    expect(album.get("jailson")?.quantidade).toBe(3);
  });

  it("inclui figurinhas bônus no álbum", () => {
    const jailson = criarMotoboy({ id: "jailson" });
    const barao = criarMotoboy({ id: "barao", nome: "Barão do Grau", raridade: "LENDARIO" });
    const album = calcularAlbum([criarPedido({ motoboy: jailson })], [barao]);
    expect(album.size).toBe(2);
    expect(album.get("barao")?.quantidade).toBe(1);
  });

  it("soma figurinha bônus na quantidade de um motoboy já coletado por pedido", () => {
    const jailson = criarMotoboy({ id: "jailson" });
    const album = calcularAlbum([criarPedido({ motoboy: jailson })], [jailson]);
    expect(album.size).toBe(1);
    expect(album.get("jailson")?.quantidade).toBe(2);
  });
});
