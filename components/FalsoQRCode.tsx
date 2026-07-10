"use client";

import { useMemo } from "react";

const TAMANHO_GRADE = 14;

export default function FalsoQRCode() {
  const celulas = useMemo(
    () => Array.from({ length: TAMANHO_GRADE * TAMANHO_GRADE }, () => Math.random() > 0.5),
    []
  );

  return (
    <div className="relative mx-auto h-56 w-56 select-none overflow-hidden rounded-2xl border border-black/10 bg-white p-3">
      <div
        className="grid h-full w-full gap-[1px]"
        style={{ gridTemplateColumns: `repeat(${TAMANHO_GRADE}, 1fr)` }}
      >
        {celulas.map((preenchida, i) => (
          <div key={i} className={preenchida ? "bg-black" : "bg-white"} />
        ))}
      </div>
      <div className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-4 border-black bg-white" />
      <div className="pointer-events-none absolute right-3 top-3 h-8 w-8 border-4 border-black bg-white" />
      <div className="pointer-events-none absolute bottom-3 left-3 h-8 w-8 border-4 border-black bg-white" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="-rotate-[20deg] rounded bg-primaria/95 px-4 py-1 text-lg font-black uppercase tracking-wide text-white shadow-lg">
          DE MENTIRINHA 🤡
        </span>
      </div>
    </div>
  );
}
