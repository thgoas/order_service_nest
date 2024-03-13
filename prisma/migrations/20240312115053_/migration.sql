/*
  Warnings:

  - You are about to drop the column `extesion` on the `images` table. All the data in the column will be lost.
  - Added the required column `extension` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "extesion",
ADD COLUMN     "extension" TEXT NOT NULL;
