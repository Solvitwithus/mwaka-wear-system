-- CreateTable
CREATE TABLE "SalesGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "groupType" TEXT NOT NULL,
    "description" TEXT,
    "defaultCommissionRate" REAL NOT NULL,
    "allowCustomCommission" BOOLEAN NOT NULL,
    "discountAllowed" REAL NOT NULL,
    "salesTarget" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesGroup_code_key" ON "SalesGroup"("code");
