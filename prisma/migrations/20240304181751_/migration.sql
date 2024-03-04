/*
  Warnings:

  - You are about to drop the column `daparture_date` on the `order_services` table. All the data in the column will be lost.
  - Added the required column `departure_date` to the `order_services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_services" DROP COLUMN "daparture_date",
ADD COLUMN     "departure_date" TIMESTAMP(3) NOT NULL;
