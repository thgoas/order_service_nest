/*
  Warnings:

  - You are about to drop the column `descritption` on the `technical_accompaniments` table. All the data in the column will be lost.
  - Added the required column `description` to the `technical_accompaniments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "technical_accompaniments" DROP COLUMN "descritption",
ADD COLUMN     "description" TEXT NOT NULL;
