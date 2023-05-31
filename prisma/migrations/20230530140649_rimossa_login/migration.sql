/*
  Warnings:

  - You are about to drop the `Logins` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logins" DROP CONSTRAINT "Logins_userId_fkey";

-- DropTable
DROP TABLE "Logins";
