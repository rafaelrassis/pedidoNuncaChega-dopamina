"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCarrinho } from "./CarrinhoProvider";
import { formatarPreco } from "@/lib/carrinho";

const DURACAO_INICIAL_SEGUNDOS = 180;

type EventoFeed = { texto: string; horario: string };

function horaAgora(): string {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatarTempo(segundos: number): string {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min}:${String(seg).padStart(2, "0")}`;
}

export default function TrackingModal() {
  const { pedidoAtual, trackingAberto, marcarPedidoEntregue } = useCarrinho();
  const [segundosRestantes, setSegundosRestantes] = useState(DURACAO_INICIAL_SEGUNDOS);
  const [duracaoTotal, setDuracaoTotal] = useState(DURACAO_INICIAL_SEGUNDOS);
  const [eventos, setEventos] = useState<EventoFeed[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [permissaoNotificacao, setPermissaoNotificacao] =
    useState<NotificationPermission | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!trackingAberto || !pedidoAtual) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;

    setPermissaoNotificacao(Notification.permission);
    if (Notification.permission === "default") {
      Notification.requestPermission().then(setPermissaoNotificacao);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingAberto, pedidoAtual?.id]);

  useEffect(() => {
    if (!trackingAberto || !pedidoAtual) return;

    setSegundosRestantes(DURACAO_INICIAL_SEGUNDOS);
    setDuracaoTotal(DURACAO_INICIAL_SEGUNDOS);
    setEventos([{ texto: "Pedido confirmado ✅", horario: horaAgora() }]);

    const nomeMotoboy = pedidoAtual.motoboy.nome;
    const agendar = (segundos: number, executar: () => void) => {
      timeoutsRef.current.push(setTimeout(executar, segundos * 1000));
    };

    agendar(4, () =>
      setEventos((atual) => [...atual, { texto: "Cozinha preparando 👩‍🍳", horario: horaAgora() }])
    );
    agendar(40, () =>
      setEventos((atual) => [
        ...atual,
        { texto: `${nomeMotoboy} chegou no restaurante 🏍️`, horario: horaAgora() },
      ])
    );
    agendar(65, () =>
      setEventos((atual) => [...atual, { texto: "Saiu pra entrega 🚀", horario: horaAgora() }])
    );
    agendar(110, () => {
      if (Math.random() > 0.5) {
        setDuracaoTotal((d) => d + 40);
        setSegundosRestantes((s) => s + 40);
        setEventos((atual) => [
          ...atual,
          { texto: "Pegou chuva, +40s de emoção 🌧️", horario: horaAgora() },
        ]);
      } else {
        setEventos((atual) => [
          ...atual,
          { texto: "Parou pra tomar uma água de coco 🥥", horario: horaAgora() },
        ]);
      }
    });

    const intervalo = setInterval(() => {
      setSegundosRestantes((atual) => {
        if (atual <= 1) {
          clearInterval(intervalo);
          return 0;
        }
        return atual - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalo);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
    // Reinicia o rastreamento apenas quando um novo pedido é aberto —
    // usar o objeto inteiro reiniciaria os timers a cada atualização de status.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingAberto, pedidoAtual?.id]);

  useEffect(() => {
    if (segundosRestantes === 0 && pedidoAtual && trackingAberto) {
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Seu pedido \"chegou\"! 🎉", {
            body: `Pedido #${pedidoAtual.id} — a comida nunca vem, mas a dopamina sim.`,
            icon: "/icons/icon-192.png",
          });
        }
      }
      marcarPedidoEntregue(pedidoAtual.id);
    }
  }, [segundosRestantes, pedidoAtual, trackingAberto, marcarPedidoEntregue]);

  function mostrarToast(mensagem: string) {
    setToast(mensagem);
    setTimeout(() => setToast(null), 2500);
  }

  async function compartilhar() {
    if (!pedidoAtual) return;
    const texto = `Pedi ${pedidoAtual.itens[0]?.nome ?? "uma comida"} no PedidoNuncaChega e tô esperando até hoje 😂 ${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: texto });
      } catch {
        // usuário cancelou o compartilhamento
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(texto);
      mostrarToast("Link copiado! (mas ninguém vai acreditar 😂)");
    } catch {
      mostrarToast("Não deu pra copiar, mas a intenção era boa 🤷");
    }
  }

  if (!trackingAberto || !pedidoAtual) return null;

  const progresso = Math.min(
    1,
    Math.max(0, 1 - segundosRestantes / duracaoTotal)
  );
  const xMotoboy = 20 + progresso * 260;
  const yMotoboy = 80 - Math.sin(progresso * Math.PI) * 55;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl">
        <div className="flex flex-col gap-4 p-6">
          <div>
            <h2 className="font-display text-xl font-bold">🏍️ A caminho!</h2>
            <p className="text-sm text-foreground/60">
              Pedido #{pedidoAtual.id} · &ldquo;pago&rdquo; {formatarPreco(pedidoAtual.total)}
            </p>
          </div>

          <svg viewBox="0 0 300 100" className="w-full">
            <path
              d="M20 80 C 80 20, 220 20, 280 80"
              stroke="#E2574C55"
              strokeWidth="4"
              fill="none"
              strokeDasharray="6 6"
            />
            <text x="6" y="95" fontSize="20">
              🍽️
            </text>
            <text x="262" y="95" fontSize="20">
              🏠
            </text>
            <text
              x={xMotoboy}
              y={yMotoboy}
              fontSize="22"
              textAnchor="middle"
              style={{ transition: "x 1s linear, y 1s linear" }}
            >
              🏍️
            </text>
          </svg>

          <div>
            <div className="mb-1 flex justify-between text-sm font-semibold">
              <span>Chegando em</span>
              <span>{formatarTempo(segundosRestantes)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-primaria transition-all duration-1000"
                style={{ width: `${progresso * 100}%` }}
              />
            </div>
            {permissaoNotificacao === "denied" && (
              <p className="mt-1 text-xs text-foreground/40">
                🔕 Notificações bloqueadas — ative pra saber quando o pedido &ldquo;chegar&rdquo;
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-fundo p-3">
            <span className="text-3xl">{pedidoAtual.motoboy.avatarEmoji}</span>
            <div className="flex-1">
              <p className="text-sm font-bold">{pedidoAtual.motoboy.nome}</p>
              <p className="text-xs text-foreground/60">&ldquo;{pedidoAtual.motoboy.frase}&rdquo;</p>
            </div>
            <button
              onClick={() =>
                mostrarToast(`O ${pedidoAtual.motoboy.nome} não atende, tá pilotando 🏍️`)
              }
              className="shrink-0 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold"
            >
              📞 Ligar
            </button>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Status do pedido</h3>
            <ul className="flex flex-col gap-1.5 text-xs text-foreground/70">
              {eventos.map((evento, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span>{evento.texto}</span>
                  <span className="shrink-0 text-foreground/40">{evento.horario}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-black/10 p-4">
            <h3 className="font-display text-base font-bold">Enquanto você espera 🍳</h3>
            <p className="text-sm text-foreground/70">
              A comida nunca vem... mas a receita é real e grátis.
            </p>
            <div className="flex flex-wrap gap-2">
              {pedidoAtual.itens.map((item) => (
                <Link
                  key={item.itemId}
                  href={`/receitas/${item.slug}`}
                  className="rounded-full bg-fundo px-3 py-1.5 text-xs font-semibold text-primaria"
                >
                  📖 Receita de {item.nome}
                </Link>
              ))}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">
                🏍️ Manda uma gorjeta divertida — é imaginária, guarda seu dinheiro!
              </p>
              <div className="flex gap-2">
                {[4, 20, 40].map((valor) => (
                  <button
                    key={valor}
                    onClick={() =>
                      mostrarToast(`Gorjeta de R$ ${valor} "enviada" 🎉 (o dinheiro é seu mesmo)`)
                    }
                    className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-semibold hover:border-primaria"
                  >
                    R$ {valor}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={compartilhar}
              className="self-start rounded-full bg-primaria px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              📸 Compartilhar
            </button>
          </div>
        </div>

        {toast && (
          <div className="sticky bottom-0 mx-4 mb-4 rounded-xl bg-black/85 px-4 py-2 text-center text-sm text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
