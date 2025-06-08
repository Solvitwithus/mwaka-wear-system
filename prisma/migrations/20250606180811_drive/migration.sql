/*
  Warnings:

  - You are about to drop the column `licenseExpiryDate` on the `Driver` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Driver" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "licenseIssueDate" TEXT,
    "dateOfBirth" TEXT,
    "address" TEXT,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Driver" ("address", "createdAt", "dateOfBirth", "email", "firstName", "id", "lastName", "licenseNumber", "phoneNumber", "remarks", "updatedAt", "userName") SELECT "address", "createdAt", "dateOfBirth", "email", "firstName", "id", "lastName", "licenseNumber", "phoneNumber", "remarks", "updatedAt", "userName" FROM "Driver";
DROP TABLE "Driver";
ALTER TABLE "new_Driver" RENAME TO "Driver";
CREATE UNIQUE INDEX "Driver_userName_key" ON "Driver"("userName");
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
