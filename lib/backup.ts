import { z } from "zod";
import { storage } from "./storage";

const opcaoSelecionadaSchema = z.object({
  grupo: z.string(),
  nome: z.string(),
  acrescimo: z.number(),
});

const regiaoSchema = z.enum(["NORDESTE", "NORTE", "SUDESTE", "SUL", "CENTRO_OESTE"]);

const itemCarrinhoSchema = z.object({
  itemId: z.string(),
  comidaId: z.string(),
  nome: z.string(),
  slug: z.string(),
  fotoUrl: z.string(),
  regiao: regiaoSchema,
  precoUnitario: z.number(),
  precoOriginalUnitario: z.number(),
  quantidade: z.number(),
  opcoes: z.array(opcaoSelecionadaSchema),
});

const motoboyPublicoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  avatarEmoji: z.string(),
  fotoUrl: z.string().nullable().default(null),
  frase: z.string(),
  raridade: z.enum(["COMUM", "RARO", "LENDARIO"]),
  pesoSorteio: z.number(),
});

const pedidoSalvoSchema = z.object({
  id: z.string(),
  itens: z.array(itemCarrinhoSchema),
  subtotal: z.number(),
  economia: z.number(),
  entrega: z.number(),
  impostos: z.number(),
  total: z.number(),
  criadoEm: z.string(),
  motoboy: motoboyPublicoSchema,
  status: z.enum(["a_caminho", "entregue"]),
  avaliacao: z.number().optional(),
});

const streakSchema = z.object({
  dias: z.number(),
  ultimaData: z.string().nullable(),
});

export const VERSAO_BACKUP_ATUAL = 1;

export const backupSchema = z.object({
  versao: z.literal(VERSAO_BACKUP_ATUAL),
  pedidos: z.array(pedidoSalvoSchema),
  streak: streakSchema,
  figurinhasBonus: z.array(motoboyPublicoSchema),
  carrinho: z.array(itemCarrinhoSchema),
  enderecoIndice: z.number(),
  contadorDesejos: z.number(),
  repetidasConsumidas: z.record(z.string(), z.number()).default({}),
});

export type BackupProgresso = z.infer<typeof backupSchema>;

export type ResultadoImportacao = { sucesso: true } | { sucesso: false; erro: string };

export function exportarProgresso(): string {
  const backup: BackupProgresso = {
    versao: VERSAO_BACKUP_ATUAL,
    pedidos: storage.getPedidos(),
    streak: storage.getStreak(),
    figurinhasBonus: storage.getFigurinhasBonus(),
    carrinho: storage.getCarrinho(),
    enderecoIndice: storage.getEnderecoIndice(),
    contadorDesejos: storage.getContadorDesejos(),
    repetidasConsumidas: storage.getRepetidasConsumidas(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importarProgresso(json: string): ResultadoImportacao {
  let dados: unknown;
  try {
    dados = JSON.parse(json);
  } catch {
    return { sucesso: false, erro: "Esse arquivo não é um JSON válido." };
  }

  const resultado = backupSchema.safeParse(dados);
  if (!resultado.success) {
    return {
      sucesso: false,
      erro: "Backup inválido ou de uma versão que a gente não reconhece.",
    };
  }

  const backup = resultado.data;
  storage.setPedidos(backup.pedidos);
  storage.setStreak(backup.streak);
  storage.setFigurinhasBonus(backup.figurinhasBonus);
  storage.setCarrinho(backup.carrinho);
  storage.setEnderecoIndice(backup.enderecoIndice);
  storage.setContadorDesejos(backup.contadorDesejos);
  storage.setRepetidasConsumidas(backup.repetidasConsumidas);

  return { sucesso: true };
}
