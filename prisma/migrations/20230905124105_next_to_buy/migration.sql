-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "comment" SET DEFAULT '';

-- CreateTable
CREATE TABLE "BookToBuy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "volume" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BookToBuy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookToBuy" ADD CONSTRAINT "BookToBuy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
