-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "description" TEXT,
    "excludeFromSale" BOOLEAN NOT NULL DEFAULT false,
    "excludeFromPurchase" BOOLEAN NOT NULL DEFAULT false,
    "branch" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "itemPrice" REAL NOT NULL DEFAULT 0,
    "discountWholesale" REAL NOT NULL DEFAULT 0,
    "discountRetail" REAL NOT NULL DEFAULT 0,
    "customDiscountAllowed" BOOLEAN NOT NULL DEFAULT false,
    "taxType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Item" ("barcode", "branch", "category", "code", "createdAt", "creator", "description", "excludeFromPurchase", "excludeFromSale", "id", "name", "status", "unitOfMeasure", "updatedAt") SELECT "barcode", "branch", "category", "code", "createdAt", "creator", "description", "excludeFromPurchase", "excludeFromSale", "id", "name", "status", "unitOfMeasure", "updatedAt" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_code_key" ON "Item"("code");
CREATE UNIQUE INDEX "Item_barcode_key" ON "Item"("barcode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
