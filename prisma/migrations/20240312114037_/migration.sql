-- DropForeignKey
ALTER TABLE "history_order_service" DROP CONSTRAINT "history_order_service_order_id_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_order_id_fkey";

-- DropForeignKey
ALTER TABLE "technical_accompaniments" DROP CONSTRAINT "technical_accompaniments_order_service_id_fkey";

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_order_service" ADD CONSTRAINT "history_order_service_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_accompaniments" ADD CONSTRAINT "technical_accompaniments_order_service_id_fkey" FOREIGN KEY ("order_service_id") REFERENCES "order_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
