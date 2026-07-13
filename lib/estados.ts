import type { Estado, Regiao } from "@prisma/client";

export const ESTADOS_INFO: {
  valor: Estado;
  rotulo: string;
  regiao: Regiao;
  emoji: string;
}[] = [
  { valor: "AC", rotulo: "Acre", regiao: "NORTE", emoji: "🌳" },
  { valor: "AL", rotulo: "Alagoas", regiao: "NORDESTE", emoji: "🏖️" },
  { valor: "AP", rotulo: "Amapá", regiao: "NORTE", emoji: "🌳" },
  { valor: "AM", rotulo: "Amazonas", regiao: "NORTE", emoji: "🌳" },
  { valor: "BA", rotulo: "Bahia", regiao: "NORDESTE", emoji: "🌵" },
  { valor: "CE", rotulo: "Ceará", regiao: "NORDESTE", emoji: "🌵" },
  { valor: "DF", rotulo: "Distrito Federal", regiao: "CENTRO_OESTE", emoji: "🌾" },
  { valor: "ES", rotulo: "Espírito Santo", regiao: "SUDESTE", emoji: "🏙️" },
  { valor: "GO", rotulo: "Goiás", regiao: "CENTRO_OESTE", emoji: "🌾" },
  { valor: "MA", rotulo: "Maranhão", regiao: "NORDESTE", emoji: "🌵" },
  { valor: "MT", rotulo: "Mato Grosso", regiao: "CENTRO_OESTE", emoji: "🌾" },
  { valor: "MS", rotulo: "Mato Grosso do Sul", regiao: "CENTRO_OESTE", emoji: "🌾" },
  { valor: "MG", rotulo: "Minas Gerais", regiao: "SUDESTE", emoji: "🏙️" },
  { valor: "PA", rotulo: "Pará", regiao: "NORTE", emoji: "🌳" },
  { valor: "PB", rotulo: "Paraíba", regiao: "NORDESTE", emoji: "🌵" },
  { valor: "PR", rotulo: "Paraná", regiao: "SUL", emoji: "🧉" },
  { valor: "PE", rotulo: "Pernambuco", regiao: "NORDESTE", emoji: "🌵" },
  { valor: "PI", rotulo: "Piauí", regiao: "NORDESTE", emoji: "🌵" },
  { valor: "RJ", rotulo: "Rio de Janeiro", regiao: "SUDESTE", emoji: "🏙️" },
  { valor: "RN", rotulo: "Rio Grande do Norte", regiao: "NORDESTE", emoji: "🌵" },
  { valor: "RS", rotulo: "Rio Grande do Sul", regiao: "SUL", emoji: "🧉" },
  { valor: "RO", rotulo: "Rondônia", regiao: "NORTE", emoji: "🌳" },
  { valor: "RR", rotulo: "Roraima", regiao: "NORTE", emoji: "🌳" },
  { valor: "SC", rotulo: "Santa Catarina", regiao: "SUL", emoji: "🧉" },
  { valor: "SP", rotulo: "São Paulo", regiao: "SUDESTE", emoji: "🏙️" },
  { valor: "SE", rotulo: "Sergipe", regiao: "NORDESTE", emoji: "🌵" },
  { valor: "TO", rotulo: "Tocantins", regiao: "NORTE", emoji: "🌳" },
];
