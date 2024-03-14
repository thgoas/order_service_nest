/*
  Warnings:

  - You are about to drop the column `kind_of_person` on the `customers` table. All the data in the column will be lost.
  - Added the required column `legal_person` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "kind_of_person",
ADD COLUMN     "legal_person" BOOLEAN NOT NULL;
