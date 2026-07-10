import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export const opcaoSchema = z.object({
  nome: z.string().min(1),
  acrescimo: z.number(),
});

export const grupoOpcoesSchema = z.object({
  grupo: z.string().min(1),
  tipo: z.enum(["radio", "checkbox"]),
  opcoes: z.array(opcaoSchema).min(1),
});

export const opcoesJsonSchema = z.array(grupoOpcoesSchema);

export const regiaoSchema = z.enum([
  "NORDESTE",
  "NORTE",
  "SUDESTE",
  "SUL",
  "CENTRO_OESTE",
]);

export const raridadeSchema = z.enum(["COMUM", "RARO", "LENDARIO"]);

export const comidaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug deve ser kebab-case"),
  regiao: regiaoSchema,
  descricao: z.string().min(1, "Descrição é obrigatória"),
  precoFake: z.number().nonnegative(),
  descontoPct: z.number().int().min(0).max(100),
  avaliacaoFake: z.number().min(0).max(5),
  numAvaliacoesFake: z.number().int().nonnegative(),
  tempoPreparoMin: z.number().int().positive(),
  fotoUrl: z.string().min(1, "URL da foto é obrigatória"),
  vegetariano: z.boolean(),
  trending: z.boolean(),
  best: z.boolean(),
  opcoesJson: opcoesJsonSchema,
  receitaMd: z.string().min(1, "Receita é obrigatória"),
  ativo: z.boolean(),
});

export const comidaUpdateSchema = comidaSchema.partial();

export const motoboySchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  avatarEmoji: z.string().min(1, "Emoji é obrigatório"),
  frase: z.string().min(1, "Frase é obrigatória"),
  raridade: raridadeSchema,
  pesoSorteio: z.number().int().positive(),
  ativo: z.boolean(),
});

export const motoboyUpdateSchema = motoboySchema.partial();

export const tierDoacaoSchema = z.object({
  valor: z.number().positive(),
  rotulo: z.string().min(1),
});

export const configSchema = z.object({
  chavePix: z.string().min(1, "Chave PIX é obrigatória"),
  nomeRecebedor: z.string().min(1, "Nome do recebedor é obrigatório"),
  cidadeRecebedor: z.string().min(1, "Cidade do recebedor é obrigatória"),
  tiersDoacaoJson: z.array(tierDoacaoSchema),
  textosJson: z.record(z.string(), z.string()),
});
