/*
  Warnings:

  - You are about to drop the `BookToBuy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookToBuy" DROP CONSTRAINT "BookToBuy_userId_fkey";

-- DropTable
DROP TABLE "BookToBuy";
