-- CreateEnum
CREATE TYPE "Regiao" AS ENUM ('NORDESTE', 'NORTE', 'SUDESTE', 'SUL', 'CENTRO_OESTE');

-- CreateEnum
CREATE TYPE "Raridade" AS ENUM ('COMUM', 'RARO', 'LENDARIO');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comida" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "regiao" "Regiao" NOT NULL,
    "descricao" TEXT NOT NULL,
    "precoFake" DECIMAL(10,2) NOT NULL,
    "descontoPct" INTEGER NOT NULL DEFAULT 0,
    "avaliacaoFake" DECIMAL(2,1) NOT NULL DEFAULT 4.7,
    "numAvaliacoesFake" INTEGER NOT NULL DEFAULT 1200,
    "tempoPreparoMin" INTEGER NOT NULL DEFAULT 25,
    "fotoUrl" TEXT NOT NULL,
    "vegetariano" BOOLEAN NOT NULL DEFAULT false,
    "trending" BOOLEAN NOT NULL DEFAULT false,
    "best" BOOLEAN NOT NULL DEFAULT false,
    "opcoesJson" JSONB NOT NULL,
    "receitaMd" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motoboy" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "avatarEmoji" TEXT NOT NULL,
    "frase" TEXT NOT NULL,
    "raridade" "Raridade" NOT NULL,
    "pesoSorteio" INTEGER NOT NULL DEFAULT 10,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Motoboy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "chavePix" TEXT NOT NULL,
    "nomeRecebedor" TEXT NOT NULL,
    "cidadeRecebedor" TEXT NOT NULL,
    "tiersDoacaoJson" JSONB NOT NULL,
    "textosJson" JSONB NOT NULL,

    CONSTRAINT "Configuracao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Comida_slug_key" ON "Comida"("slug");
