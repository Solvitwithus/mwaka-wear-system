/*
  Warnings:

  - Added the required column `updatedAt` to the `VehicleCategory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VehicleCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoryName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "maxLoad" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_VehicleCategory" ("categoryName", "description", "id", "isActive", "maxLoad", "type") SELECT "categoryName", "description", "id", "isActive", "maxLoad", "type" FROM "VehicleCategory";
DROP TABLE "VehicleCategory";
ALTER TABLE "new_VehicleCategory" RENAME TO "VehicleCategory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
