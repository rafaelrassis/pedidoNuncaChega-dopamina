export function extrairIngredientesEModoPreparo(receitaMd: string): {
  ingredientes: string[];
  modoPreparo: string[];
} {
  const linhas = receitaMd.split("\n").map((l) => l.trim());
  const ingredientes: string[] = [];
  const modoPreparo: string[] = [];
  let secao: "ingredientes" | "modo" | null = null;

  for (const linha of linhas) {
    if (/^##\s*ingredientes/i.test(linha)) {
      secao = "ingredientes";
      continue;
    }
    if (/^##\s*modo de preparo/i.test(linha)) {
      secao = "modo";
      continue;
    }
    if (linha.startsWith("#")) {
      secao = null;
      continue;
    }
    if (secao === "ingredientes" && linha.startsWith("- ")) {
      ingredientes.push(linha.slice(2));
    }
    if (secao === "modo" && /^\d+\.\s/.test(linha)) {
      modoPreparo.push(linha.replace(/^\d+\.\s/, ""));
    }
  }

  return { ingredientes, modoPreparo };
}
