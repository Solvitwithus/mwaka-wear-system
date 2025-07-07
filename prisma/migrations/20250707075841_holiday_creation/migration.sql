-- CreateTable
CREATE TABLE "Holiday" (
    "id" TEXT NOT NULL,
    "holidayCode" TEXT NOT NULL,
    "holidayName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "applicableBranches" TEXT[],
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Holiday_holidayCode_key" ON "Holiday"("holidayCode");
