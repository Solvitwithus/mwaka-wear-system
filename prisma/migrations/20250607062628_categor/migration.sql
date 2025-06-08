/*
  Warnings:

  - The primary key for the `VehicleCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `VehicleCategory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `VehicleCategory` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `VehicleCategory` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Made the column `description` on table `VehicleCategory` required. This step will fail if there are existing NULL values in that column.

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
    "isActive" BOOLEAN NOT NULL
);
INSERT INTO "new_VehicleCategory" ("categoryName", "description", "id", "isActive", "maxLoad", "type") SELECT "categoryName", "description", "id", "isActive", "maxLoad", "type" FROM "VehicleCategory";
DROP TABLE "VehicleCategory";
ALTER TABLE "new_VehicleCategory" RENAME TO "VehicleCategory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
