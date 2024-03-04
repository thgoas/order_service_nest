-- AlterTable
ALTER TABLE "order_services" ADD COLUMN     "identification_number" TEXT,
ALTER COLUMN "serie_number" DROP NOT NULL;
