/*
  Warnings:

  - Added the required column `unit` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "unit" "Unit" NOT NULL;

-- CreateTable
CREATE TABLE "konj" (
    "id" TEXT NOT NULL,

    CONSTRAINT "konj_pkey" PRIMARY KEY ("id")
);
