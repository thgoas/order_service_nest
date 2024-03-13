/*
  Warnings:

  - Added the required column `user_id` to the `technical_accompaniments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "technical_accompaniments" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "technical_accompaniments" ADD CONSTRAINT "technical_accompaniments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
