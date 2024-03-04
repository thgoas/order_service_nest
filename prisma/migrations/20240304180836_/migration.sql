/*
  Warnings:

  - Added the required column `email_client` to the `order_services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_services" ADD COLUMN     "email_client" TEXT NOT NULL;
