/*
  Warnings:

  - You are about to drop the column `de3scription` on the `Todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "de3scription",
ADD COLUMN     "description" TEXT;
