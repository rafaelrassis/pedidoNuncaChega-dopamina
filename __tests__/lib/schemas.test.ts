import { describe, expect, it } from "vitest";
import { comidaSchema, configSchema, motoboySchema, senhaSchema } from "@/lib/schemas";

const comidaValida = {
  nome: "Feijoada",
  slug: "feijoada",
  regiao: "SUDESTE" as const,
  estado: "RJ" as const,
  descricao: "O clássico prato de sábado.",
  precoFake: 42.9,
  descontoPct: 20,
  avaliacaoFake: 4.7,
  numAvaliacoesFake: 1200,
  tempoPreparoMin: 25,
  fotoUrl: "/img/feijoada.jpg",
  vegetariano: false,
  trending: false,
  best: false,
  opcoesJson: [
    {
      grupo: "Porção",
      tipo: "radio" as const,
      opcoes: [{ nome: "Normal", acrescimo: 0 }],
    },
  ],
  receitaMd: "# Feijoada",
  ativo: true,
};

describe("comidaSchema", () => {
  it("aceita uma comida válida", () => {
    expect(comidaSchema.safeParse(comidaValida).success).toBe(true);
  });

  it("rejeita slug com maiúscula", () => {
    const resultado = comidaSchema.safeParse({ ...comidaValida, slug: "Feijoada" });
    expect(resultado.success).toBe(false);
  });

  it("rejeita slug com espaço ou underscore", () => {
    expect(comidaSchema.safeParse({ ...comidaValida, slug: "feij oada" }).success).toBe(false);
    expect(comidaSchema.safeParse({ ...comidaValida, slug: "feij_oada" }).success).toBe(false);
  });

  it("rejeita desconto acima de 100", () => {
    const resultado = comidaSchema.safeParse({ ...comidaValida, descontoPct: 101 });
    expect(resultado.success).toBe(false);
  });

  it("rejeita desconto negativo", () => {
    expect(comidaSchema.safeParse({ ...comidaValida, descontoPct: -1 }).success).toBe(false);
  });

  it("rejeita região fora do enum", () => {
    const resultado = comidaSchema.safeParse({ ...comidaValida, regiao: "MARTE" });
    expect(resultado.success).toBe(false);
  });

  it("rejeita opcoesJson vazio dentro de um grupo", () => {
    const resultado = comidaSchema.safeParse({
      ...comidaValida,
      opcoesJson: [{ grupo: "Porção", tipo: "radio", opcoes: [] }],
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita nome vazio", () => {
    expect(comidaSchema.safeParse({ ...comidaValida, nome: "" }).success).toBe(false);
  });
});

const motoboyValido = {
  nome: "Jailson da Biz",
  avatarEmoji: "🏍️",
  frase: "Tô chegando, confia",
  raridade: "COMUM" as const,
  pesoSorteio: 10,
  ativo: true,
};

describe("motoboySchema", () => {
  it("aceita um motoboy válido", () => {
    expect(motoboySchema.safeParse(motoboyValido).success).toBe(true);
  });

  it("rejeita raridade fora do enum", () => {
    expect(
      motoboySchema.safeParse({ ...motoboyValido, raridade: "EPICO" }).success
    ).toBe(false);
  });

  it("rejeita pesoSorteio zero ou negativo", () => {
    expect(motoboySchema.safeParse({ ...motoboyValido, pesoSorteio: 0 }).success).toBe(false);
    expect(motoboySchema.safeParse({ ...motoboyValido, pesoSorteio: -5 }).success).toBe(false);
  });

  it("rejeita pesoSorteio não inteiro", () => {
    expect(motoboySchema.safeParse({ ...motoboyValido, pesoSorteio: 2.5 }).success).toBe(false);
  });

  it("rejeita frase vazia", () => {
    expect(motoboySchema.safeParse({ ...motoboyValido, frase: "" }).success).toBe(false);
  });
});

const configValida = {
  chavePix: "chave@pix.com",
  nomeRecebedor: "PedidoNuncaChega",
  cidadeRecebedor: "SAO PAULO",
  tiersDoacaoJson: [{ valor: 5, rotulo: "uma coxinha virtual" }],
  textosJson: { boasVindas: "oi" },
};

describe("configSchema", () => {
  it("aceita uma configuração válida", () => {
    expect(configSchema.safeParse(configValida).success).toBe(true);
  });

  it("rejeita chavePix vazia", () => {
    expect(configSchema.safeParse({ ...configValida, chavePix: "" }).success).toBe(false);
  });

  it("rejeita tier de doação com valor não positivo", () => {
    const resultado = configSchema.safeParse({
      ...configValida,
      tiersDoacaoJson: [{ valor: 0, rotulo: "grátis" }],
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita textosJson com valor não-string", () => {
    const resultado = configSchema.safeParse({
      ...configValida,
      textosJson: { chave: 123 },
    });
    expect(resultado.success).toBe(false);
  });
});

const senhaValida = {
  senhaAtual: "trocar123",
  novaSenha: "novaSenhaForte",
  confirmacao: "novaSenhaForte",
};

describe("senhaSchema", () => {
  it("aceita quando a nova senha e a confirmação batem e têm 8+ caracteres", () => {
    expect(senhaSchema.safeParse(senhaValida).success).toBe(true);
  });

  it("rejeita nova senha com menos de 8 caracteres", () => {
    const resultado = senhaSchema.safeParse({
      ...senhaValida,
      novaSenha: "curta1",
      confirmacao: "curta1",
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita quando a confirmação não bate com a nova senha", () => {
    const resultado = senhaSchema.safeParse({
      ...senhaValida,
      confirmacao: "outraSenha",
    });
    expect(resultado.success).toBe(false);
  });

  it("rejeita senha atual vazia", () => {
    const resultado = senhaSchema.safeParse({ ...senhaValida, senhaAtual: "" });
    expect(resultado.success).toBe(false);
  });
});
