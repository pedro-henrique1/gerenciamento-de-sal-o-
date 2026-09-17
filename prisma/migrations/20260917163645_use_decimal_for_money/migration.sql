/*
  Warnings:

  - You are about to alter the column `valorFinal` on the `Pagamento` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `precoPadrao` on the `Servico` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Pagamento" ALTER COLUMN "valorFinal" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Servico" ALTER COLUMN "precoPadrao" SET DATA TYPE DECIMAL(10,2);
