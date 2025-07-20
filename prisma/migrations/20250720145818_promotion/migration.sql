-- CreateTable
CREATE TABLE "PromotionRequest" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "promotionReason" TEXT NOT NULL,
    "promotionDate" TIMESTAMP(3) NOT NULL,
    "promotionDetails" TEXT NOT NULL,
    "performanceReview" TEXT NOT NULL,
    "documentUrl" TEXT,
    "status" TEXT,
    "approver" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionRequest_pkey" PRIMARY KEY ("id")
);
