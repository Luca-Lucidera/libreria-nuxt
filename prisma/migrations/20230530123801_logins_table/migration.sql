-- CreateTable
CREATE TABLE "Logins" (
    "id" TEXT NOT NULL,
    "sessionUUID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Logins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Logins_sessionUUID_key" ON "Logins"("sessionUUID");

-- CreateIndex
CREATE UNIQUE INDEX "Logins_userId_key" ON "Logins"("userId");

-- AddForeignKey
ALTER TABLE "Logins" ADD CONSTRAINT "Logins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
