/*
  Warnings:

  - The primary key for the `ProductDiscount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductDiscount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId]` on the table `ProductDiscount` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ProductDiscount" DROP CONSTRAINT "ProductDiscount_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "ProductDiscount_productId_key" ON "ProductDiscount"("productId");
