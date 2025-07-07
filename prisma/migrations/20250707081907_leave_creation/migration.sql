-- CreateTable
CREATE TABLE "LeaveType" (
    "id" TEXT NOT NULL,
    "leaveCode" TEXT NOT NULL,
    "leaveName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "applicableTo" TEXT[],
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaveType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeaveType_leaveCode_key" ON "LeaveType"("leaveCode");
