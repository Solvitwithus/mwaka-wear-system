-- CreateTable
CREATE TABLE "ExitRequest" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "reasonToExit" TEXT NOT NULL,
    "exitDate" TIMESTAMP(3) NOT NULL,
    "exitInterview" TEXT NOT NULL,
    "knowledgeTransferPlan" TEXT NOT NULL,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExitRequest_pkey" PRIMARY KEY ("id")
);
