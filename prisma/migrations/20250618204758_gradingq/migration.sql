-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GradedItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "qtyToHold" INTEGER,
    "sellingPrice" REAL NOT NULL,
    "quantityToDispatch" REAL NOT NULL DEFAULT 0,
    "gradingSheetId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GradedItem_gradingSheetId_fkey" FOREIGN KEY ("gradingSheetId") REFERENCES "GradingSheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GradedItem" ("createdAt", "grade", "gradingSheetId", "id", "itemCode", "itemName", "qtyToHold", "quantity", "sellingPrice", "updatedAt") SELECT "createdAt", "grade", "gradingSheetId", "id", "itemCode", "itemName", "qtyToHold", "quantity", "sellingPrice", "updatedAt" FROM "GradedItem";
DROP TABLE "GradedItem";
ALTER TABLE "new_GradedItem" RENAME TO "GradedItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
