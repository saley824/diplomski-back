/*
  Warnings:

  - The primary key for the `UserAddress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId]` on the table `UserAddress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Country` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PostalCode` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAddress" DROP CONSTRAINT "UserAddress_pkey",
ADD COLUMN     "Country" TEXT NOT NULL,
ADD COLUMN     "PostalCode" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAddress_userId_key" ON "UserAddress"("userId");

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
