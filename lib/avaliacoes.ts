export const NOTA_MINIMA = 1;
export const NOTA_MAXIMA = 5;

const TEXTOS_POR_NOTA: Record<number, string> = {
  1: "1 estrela? Justo, a comida realmente nunca chegou. 😅",
  2: "2 estrelas. O motoboy agradece o benefício da dúvida.",
  3: "3 estrelas, a média nacional do delivery que não vem.",
  4: "4 estrelas! Quase perfeito — só faltou a comida mesmo.",
  5: "5 estrelas pra uma entrega 100% imaginária. Chef's kiss. 👨‍🍳💋",
};

export function textoAvaliacao(nota: number): string {
  return TEXTOS_POR_NOTA[nota] ?? "Obrigado pela avaliação sincera. 🙏";
}
