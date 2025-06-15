-- CreateTable
CREATE TABLE "PrepaymentAllocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "salesEntryId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "allocateAll" REAL NOT NULL DEFAULT 0,
    "partialAllocation" REAL NOT NULL DEFAULT 0,
    "balance" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
