/*
  Warnings:

  - You are about to drop the `history_all` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "history_all" DROP CONSTRAINT "history_all_user_id_fkey";

-- DropTable
DROP TABLE "history_all";
