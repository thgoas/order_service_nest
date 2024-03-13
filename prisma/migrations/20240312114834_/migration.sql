/*
  Warnings:

  - You are about to drop the column `description` on the `images` table. All the data in the column will be lost.
  - Added the required column `extesion` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "description",
ADD COLUMN     "extesion" TEXT NOT NULL,
ADD COLUMN     "filename" TEXT NOT NULL;
