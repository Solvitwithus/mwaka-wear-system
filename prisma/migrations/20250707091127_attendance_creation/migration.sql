-- CreateTable
CREATE TABLE "NonAttendanceReason" (
    "id" TEXT NOT NULL,
    "reasonCode" TEXT NOT NULL,
    "reasonName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "applicableTo" TEXT[],
    "status" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NonAttendanceReason_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NonAttendanceReason_reasonCode_key" ON "NonAttendanceReason"("reasonCode");
