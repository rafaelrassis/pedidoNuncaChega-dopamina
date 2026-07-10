import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export const opcaoItemSchema = z.object({
  nome: z.string().min(1),
  acrescimo: z.number(),
});

export const grupoOpcoesSchema = z.object({
  grupo: z.string().min(1),
  tipo: z.enum(["radio", "checkbox"]),
  opcoes: z.array(opcaoItemSchema).min(1),
});

export const regiaoSchema = z.enum([
  "NORDESTE",
  "NORTE",
  "SUDESTE",
  "SUL",
  "CENTRO_OESTE",
]);

export const raridadeSchema = z.enum(["COMUM", "RARO", "LENDARIO"]);

export const comidaSchema = z.object({
  nome: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas minúsculas, números e hífen"),
  regiao: regiaoSchema,
  descricao: z.string().min(1),
  precoFake: z.number().nonnegative(),
  descontoPct: z.number().int().min(0).max(100),
  avaliacaoFake: z.number().min(0).max(5),
  numAvaliacoesFake: z.number().int().nonnegative(),
  tempoPreparoMin: z.number().int().positive(),
  fotoUrl: z.string().min(1),
  vegetariano: z.boolean(),
  trending: z.boolean(),
  best: z.boolean(),
  opcoesJson: z.array(grupoOpcoesSchema),
  receitaMd: z.string().min(1),
  ativo: z.boolean(),
});

export const comidaUpdateSchema = comidaSchema.partial();

export const motoboySchema = z.object({
  nome: z.string().min(1),
  avatarEmoji: z.string().min(1),
  frase: z.string().min(1),
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
  chavePix: z.string().min(1),
  nomeRecebedor: z.string().min(1),
  cidadeRecebedor: z.string().min(1),
  tiersDoacaoJson: z.array(tierDoacaoSchema),
  textosJson: z.record(z.string(), z.string()),
});
