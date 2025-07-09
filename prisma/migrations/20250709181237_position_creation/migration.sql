-- CreateTable
CREATE TABLE "PositionRequisition" (
    "id" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "contractType" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "numberOfPositions" INTEGER NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "reasonForRequisition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PositionRequisition_pkey" PRIMARY KEY ("id")
);
