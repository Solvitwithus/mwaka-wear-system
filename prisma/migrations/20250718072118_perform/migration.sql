-- CreateTable
CREATE TABLE "PerformanceEvaluation" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "evaluationDate" TIMESTAMP(3) NOT NULL,
    "evaluationTime" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "overallFeedback" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "skills" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceEvaluation_pkey" PRIMARY KEY ("id")
);
