-- CreateTable
CREATE TABLE "SalesCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceAdjustmentType" TEXT NOT NULL,
    "priceAdjustment" REAL NOT NULL,
    "allowCredit" BOOLEAN NOT NULL,
    "creditLimit" REAL,
    "defaultPaymentTerm" TEXT,
    "applicableChannels" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesCategory_code_key" ON "SalesCategory"("code");
