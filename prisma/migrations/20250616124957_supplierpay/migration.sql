-- CreateTable
CREATE TABLE "SupplierPaymentTracking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "purchaseEntryId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "allocatedAmount" REAL NOT NULL DEFAULT 0,
    "balance" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
