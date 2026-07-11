import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { CarrinhoProvider, useCarrinho } from "@/components/CarrinhoProvider";
import CarrinhoDrawer from "@/components/CarrinhoDrawer";
import { criarMotoboy } from "../fixtures";

function mockFetchMotoboys() {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([criarMotoboy()]),
    })
  );
}

beforeEach(() => {
  window.localStorage.clear();
  mockFetchMotoboys();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function AbrirCarrinhoVazio() {
  const { abrirCarrinho } = useCarrinho();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => abrirCarrinho(), []);
  return null;
}

function BotaoAdicionarItem() {
  const { adicionarItem } = useCarrinho();
  return (
    <button
      onClick={() =>
        adicionarItem({
          comidaId: "comida-1",
          nome: "Feijoada",
          slug: "feijoada",
          fotoUrl: "/img/feijoada.jpg",
          regiao: "SUDESTE",
          precoUnitario: 30,
          precoOriginalUnitario: 40,
          quantidade: 2,
          opcoes: [],
        })
      }
    >
      adicionar
    </button>
  );
}

describe("CarrinhoDrawer", () => {
  it("renderiza o estado vazio com humor", () => {
    render(
      <CarrinhoProvider>
        <AbrirCarrinhoVazio />
        <CarrinhoDrawer />
      </CarrinhoProvider>
    );

    expect(screen.getByText(/sua marmita tá vazia/i)).toBeInTheDocument();
  });

  it("renderiza itens e totais calculados", async () => {
    const user = userEvent.setup();
    render(
      <CarrinhoProvider>
        <BotaoAdicionarItem />
        <CarrinhoDrawer />
      </CarrinhoProvider>
    );

    await user.click(screen.getByText("adicionar"));

    // subtotal = 30 * 2 = 60; entrega (30%) = 18; impostos (5%) = 3; total = 81
    expect(screen.getByText("Feijoada")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*81,00/)).toBeInTheDocument();
  });
});
