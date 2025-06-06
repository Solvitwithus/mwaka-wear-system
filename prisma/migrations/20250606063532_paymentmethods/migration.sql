-- CreateTable
CREATE TABLE "PaymentTerm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalDuration" INTEGER NOT NULL,
    "numInstallments" INTEGER NOT NULL,
    "installments" JSONB NOT NULL,
    "startDateRule" TEXT NOT NULL,
    "gracePeriod" INTEGER NOT NULL,
    "lateFeeEnabled" BOOLEAN NOT NULL,
    "lateFeeType" TEXT NOT NULL,
    "lateFeeAmount" REAL NOT NULL,
    "lateFeeAfterDays" INTEGER NOT NULL,
    "earlyDiscountEnabled" BOOLEAN NOT NULL,
    "earlyDiscountPercent" REAL NOT NULL,
    "earlyDiscountWithinDays" INTEGER NOT NULL,
    "allowedMethods" TEXT NOT NULL,
    "applicableTo" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
