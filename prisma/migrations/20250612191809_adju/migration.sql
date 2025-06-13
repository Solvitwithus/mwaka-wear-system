/*
  Warnings:

  - You are about to alter the column `creditLimit` on the `SalesCategory` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SalesCategory" (
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
INSERT INTO "new_SalesCategory" ("allowCredit", "applicableChannels", "code", "createdAt", "creditLimit", "defaultPaymentTerm", "description", "id", "isActive", "name", "priceAdjustment", "priceAdjustmentType", "remarks", "updatedAt") SELECT "allowCredit", "applicableChannels", "code", "createdAt", "creditLimit", "defaultPaymentTerm", "description", "id", "isActive", "name", "priceAdjustment", "priceAdjustmentType", "remarks", "updatedAt" FROM "SalesCategory";
DROP TABLE "SalesCategory";
ALTER TABLE "new_SalesCategory" RENAME TO "SalesCategory";
CREATE UNIQUE INDEX "SalesCategory_code_key" ON "SalesCategory"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
