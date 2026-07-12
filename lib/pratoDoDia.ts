export type ComidaElegivel = { id: string; ativo?: boolean };

function hashDeterministico(texto: string): number {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash * 31 + texto.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function escolherPratoDoDia<T extends ComidaElegivel>(
  comidas: T[],
  dataISO: string
): T | null {
  const elegiveis = comidas.filter((c) => c.ativo !== false);
  if (elegiveis.length === 0) return null;

  const indice = hashDeterministico(dataISO) % elegiveis.length;
  return elegiveis[indice];
}
