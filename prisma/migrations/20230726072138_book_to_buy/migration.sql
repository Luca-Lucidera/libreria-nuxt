-- CreateTable
CREATE TABLE "BookToBuy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BookToBuy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookToBuy" ADD CONSTRAINT "BookToBuy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
