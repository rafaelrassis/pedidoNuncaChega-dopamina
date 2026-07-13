-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

-- AlterTable: adiciona "estado" com default temporário pra permitir a coluna
-- NOT NULL em linhas já existentes; o seed corrige o valor real de cada uma
-- logo em seguida (prisma migrate deploy roda antes do seed no build).
ALTER TABLE "Comida" ADD COLUMN "estado" "Estado" NOT NULL DEFAULT 'SP';
ALTER TABLE "Comida" ALTER COLUMN "estado" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Motoboy" ADD COLUMN "fotoUrl" TEXT;
