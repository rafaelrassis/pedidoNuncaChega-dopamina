"use client";

import { useEffect, useMemo, useState } from "react";
import type { Regiao } from "@prisma/client";
import type { ComidaCliente } from "@/lib/tipos";
import { escolherPratoDoDia } from "@/lib/pratoDoDia";
import { formatarPreco } from "@/lib/carrinho";
import { CarrinhoProvider } from "./CarrinhoProvider";
import Cabecalho from "./Cabecalho";
import BarraContexto from "./BarraContexto";
import Hero from "./Hero";
import Busca from "./Busca";
import ChipsRegiao from "./ChipsRegiao";
import CardComida from "./CardComida";
import ModalComida from "./ModalComida";
import CarrinhoDrawer from "./CarrinhoDrawer";
import BarraFixaCarrinho from "./BarraFixaCarrinho";
import CheckoutModal from "./CheckoutModal";
import TrackingModal from "./TrackingModal";
import ModalEntrega from "./ModalEntrega";
import Rodape from "./Rodape";

export default function PaginaInicialCliente({ comidas }: { comidas: ComidaCliente[] }) {
  const [busca, setBusca] = useState("");
  const [regiao, setRegiao] = useState<Regiao | null>(null);
  const [comidaAberta, setComidaAberta] = useState<ComidaCliente | null>(null);
  const [pratoDoDia, setPratoDoDia] = useState<ComidaCliente | null>(null);

  useEffect(() => {
    const dataISO = new Date().toISOString().slice(0, 10);
    setPratoDoDia(escolherPratoDoDia(comidas, dataISO));
  }, [comidas]);

  const comidasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return comidas.filter((c) => {
      const combinaBusca = c.nome.toLowerCase().includes(termo);
      const combinaRegiao = !regiao || c.regiao === regiao;
      return combinaBusca && combinaRegiao;
    });
  }, [comidas, busca, regiao]);

  const bombando = comidasFiltradas.filter((c) => c.trending);

  return (
    <CarrinhoProvider>
      <div className="flex min-h-screen flex-col bg-fundo">
        <Cabecalho />
        <div className="px-6 pt-4">
          <BarraContexto />
        </div>
        <Hero />

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6">
          <Busca valor={busca} onChange={setBusca} />
          <ChipsRegiao selecionada={regiao} onSelecionar={setRegiao} />
        </div>

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-8">
          {pratoDoDia && (
            <button
              onClick={() => setComidaAberta(pratoDoDia)}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pratoDoDia.fotoUrl}
                  alt={pratoDoDia.nome}
                  className="h-full w-full object-cover text-transparent"
                />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wide text-destaque">
                  🍲 Desejo do dia
                </span>
                <h2 className="font-display text-lg font-bold">{pratoDoDia.nome}</h2>
                <p className="text-sm text-foreground/60">
                  {formatarPreco(pratoDoDia.precoFake * (1 - pratoDoDia.descontoPct / 100))}
                </p>
              </div>
            </button>
          )}

          {bombando.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-xl font-bold">🔥 Bombando agora</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bombando.map((c) => (
                  <CardComida key={c.id} comida={c} onAbrir={setComidaAberta} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-4 font-display text-xl font-bold">Todos os pratos</h2>
            {comidasFiltradas.length === 0 ? (
              <p className="text-center text-foreground/60">
                Nenhum prato encontrado. Talvez o motoboy tenha comido no caminho. 😅
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {comidasFiltradas.map((c) => (
                  <CardComida key={c.id} comida={c} onAbrir={setComidaAberta} />
                ))}
              </div>
            )}
          </section>
        </main>

        <Rodape />

        {comidaAberta && (
          <ModalComida comida={comidaAberta} onFechar={() => setComidaAberta(null)} />
        )}
        <CarrinhoDrawer />
        <BarraFixaCarrinho />
        <CheckoutModal />
        <TrackingModal />
        <ModalEntrega />
      </div>
    </CarrinhoProvider>
  );
}
