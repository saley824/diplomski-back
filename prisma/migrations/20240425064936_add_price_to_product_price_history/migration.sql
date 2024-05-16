/*
  Warnings:

  - Added the required column `newPrice` to the `ProductPriceHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductPriceHistory" ADD COLUMN     "newPrice" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "changeDate" SET DEFAULT CURRENT_TIMESTAMP;
