/*
  Warnings:

  - You are about to drop the column `City` on the `UserAddress` table. All the data in the column will be lost.
  - You are about to drop the column `Country` on the `UserAddress` table. All the data in the column will be lost.
  - You are about to drop the column `PostalCode` on the `UserAddress` table. All the data in the column will be lost.
  - You are about to drop the column `StreetName` on the `UserAddress` table. All the data in the column will be lost.
  - You are about to drop the column `StreetNumber` on the `UserAddress` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `UserAddress` table. All the data in the column will be lost.
  - Added the required column `city` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetName` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetNumber` to the `UserAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAddress" DROP COLUMN "City",
DROP COLUMN "Country",
DROP COLUMN "PostalCode",
DROP COLUMN "StreetName",
DROP COLUMN "StreetNumber",
DROP COLUMN "id",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "streetName" TEXT NOT NULL,
ADD COLUMN     "streetNumber" TEXT NOT NULL;
