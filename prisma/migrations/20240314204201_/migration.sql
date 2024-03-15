/*
  Warnings:

  - A unique constraint covering the columns `[identification_number]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "customers_identification_number_key" ON "customers"("identification_number");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");
