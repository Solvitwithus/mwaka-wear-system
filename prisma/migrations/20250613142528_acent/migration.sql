-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SalesEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "saleDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "deliveryDetailsId" TEXT NOT NULL,
    "salespersonId" TEXT NOT NULL DEFAULT 'direct',
    "subtotal" REAL NOT NULL,
    "shipping" REAL NOT NULL,
    "grandTotal" REAL NOT NULL,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Completed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SalesEntry_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SalesEntry_deliveryDetailsId_fkey" FOREIGN KEY ("deliveryDetailsId") REFERENCES "DeliveryDetail" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SalesEntry_salespersonId_fkey" FOREIGN KEY ("salespersonId") REFERENCES "Salesperson" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SalesEntry" ("clientId", "createdAt", "deliveryDetailsId", "grandTotal", "id", "remarks", "saleDate", "salespersonId", "shipping", "status", "subtotal", "updatedAt") SELECT "clientId", "createdAt", "deliveryDetailsId", "grandTotal", "id", "remarks", "saleDate", "salespersonId", "shipping", "status", "subtotal", "updatedAt" FROM "SalesEntry";
DROP TABLE "SalesEntry";
ALTER TABLE "new_SalesEntry" RENAME TO "SalesEntry";
CREATE UNIQUE INDEX "SalesEntry_deliveryDetailsId_key" ON "SalesEntry"("deliveryDetailsId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
