-- CreateTable
CREATE TABLE "technical_accompaniments" (
    "id" TEXT NOT NULL,
    "descritpion" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_service_id" INTEGER NOT NULL,

    CONSTRAINT "technical_accompaniments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "technical_accompaniments" ADD CONSTRAINT "technical_accompaniments_order_service_id_fkey" FOREIGN KEY ("order_service_id") REFERENCES "order_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
