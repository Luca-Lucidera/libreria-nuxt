/*
  Warnings:

  - You are about to drop the column `jwt` on the `User` table. All the data in the column will be lost.
  - Made the column `comment` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "comment" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "jwt";
