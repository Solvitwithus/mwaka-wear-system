-- CreateTable
CREATE TABLE "TransferRequest" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "transferReason" TEXT NOT NULL,
    "transferDate" TIMESTAMP(3) NOT NULL,
    "transferInterview" TEXT NOT NULL,
    "knowledgeTransferPlan" TEXT NOT NULL,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransferRequest_pkey" PRIMARY KEY ("id")
);
