/*
  Warnings:

  - You are about to drop the column `image` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "image",
ADD COLUMN     "img" TEXT;
