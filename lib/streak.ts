import type { Streak } from "./tipos";

function dataLocal(d: Date): string {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function atualizarStreak(atual: Streak, agora: Date = new Date()): Streak {
  const hoje = dataLocal(agora);
  if (atual.ultimaData === hoje) {
    return atual;
  }
  const ontem = dataLocal(new Date(agora.getTime() - 24 * 60 * 60 * 1000));
  const dias = atual.ultimaData === ontem ? atual.dias + 1 : 1;
  return { dias, ultimaData: hoje };
}

export function ganhouBonusHoje(streakAntigo: Streak, streakNovo: Streak): boolean {
  return streakNovo.dias !== streakAntigo.dias && streakNovo.dias % 7 === 0;
}

export function detectarStreakQuebrado(streakAntigo: Streak, streakNovo: Streak): number | null {
  if (streakAntigo.dias >= 3 && streakNovo.dias === 1) {
    return streakAntigo.dias;
  }
  return null;
}
