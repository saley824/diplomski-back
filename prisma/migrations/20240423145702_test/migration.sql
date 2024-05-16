/*
  Warnings:

  - You are about to alter the column `percentage` on the `ProductDiscount` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the `konj` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ProductDiscount" ALTER COLUMN "percentage" SET DATA TYPE INTEGER;

-- DropTable
DROP TABLE "konj";
