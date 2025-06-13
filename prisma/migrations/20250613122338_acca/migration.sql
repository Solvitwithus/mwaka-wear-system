-- CreateTable
CREATE TABLE "VehicleExpenseCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "expenseAccount" TEXT NOT NULL,
    "tag" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "appliesToAllVehicles" BOOLEAN NOT NULL DEFAULT false,
    "amount" REAL,
    "effectiveFrom" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VehicleExpenseCategory_code_key" ON "VehicleExpenseCategory"("code");
