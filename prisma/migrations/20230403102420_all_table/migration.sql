-- CreateEnum
CREATE TYPE "Type" AS ENUM ('Manga', 'Manhwa', 'Light_Novel', 'Novel', 'Book');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Plan_To_Read', 'Reading', 'Completed', 'Dropped');

-- CreateEnum
CREATE TYPE "Publisher" AS ENUM ('JPOP', 'Planet_Manga', 'Star_Comics', 'Goen', 'Dokusho', 'Other');

-- CreateTable
CREATE TABLE "TableHeaders" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "sortable" BOOLEAN NOT NULL,
    "align" TEXT DEFAULT 'center',

    CONSTRAINT "TableHeaders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "purchased" INTEGER NOT NULL DEFAULT 1,
    "read" INTEGER NOT NULL DEFAULT 0,
    "type" "Type" NOT NULL,
    "status" "Status" NOT NULL,
    "publisher" "Publisher" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "comment" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TableHeaders_title_key" ON "TableHeaders"("title");

-- CreateIndex
CREATE UNIQUE INDEX "TableHeaders_key_key" ON "TableHeaders"("key");
