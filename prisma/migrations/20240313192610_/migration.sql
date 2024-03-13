/*
  Warnings:

  - You are about to drop the `_CompanyToCustomers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company_id` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CompanyToCustomers" DROP CONSTRAINT "_CompanyToCustomers_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToCustomers" DROP CONSTRAINT "_CompanyToCustomers_B_fkey";

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "company_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CompanyToCustomers";

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
