-- CreateTable
CREATE TABLE "PriorityLevel" (
    "id" TEXT NOT NULL,
    "priorityCode" TEXT NOT NULL,
    "priorityName" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriorityLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriorityLevel_priorityCode_key" ON "PriorityLevel"("priorityCode");
