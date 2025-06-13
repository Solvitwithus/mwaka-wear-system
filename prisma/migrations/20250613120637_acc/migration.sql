-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bankName" TEXT NOT NULL,
    "accountCode" TEXT,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "accountStatus" TEXT NOT NULL DEFAULT 'Active',
    "allowOverdraft" BOOLEAN NOT NULL DEFAULT false,
    "overdraftLimit" REAL,
    "isPrimaryAccount" BOOLEAN NOT NULL DEFAULT false,
    "usedForPayroll" BOOLEAN NOT NULL DEFAULT false,
    "branchCode" TEXT,
    "departmentName" TEXT,
    "currency" TEXT NOT NULL,
    "effectiveFrom" DATETIME NOT NULL,
    "openingBalance" REAL NOT NULL,
    "reconciliationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountCode_key" ON "BankAccount"("accountCode");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountNumber_key" ON "BankAccount"("accountNumber");
