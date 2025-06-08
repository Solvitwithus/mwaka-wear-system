-- CreateTable
CREATE TABLE "Tax" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "chargeType" TEXT NOT NULL,
    "lowerLimit" REAL NOT NULL,
    "upperLimit" REAL NOT NULL,
    "rate" REAL NOT NULL,
    "fixedAmount" REAL NOT NULL,
    "reliefApplicable" BOOLEAN NOT NULL,
    "effectiveFrom" DATETIME NOT NULL,
    "branch" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Tax_code_key" ON "Tax"("code");
