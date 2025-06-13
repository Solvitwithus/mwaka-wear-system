/*
  Warnings:

  - You are about to drop the column `rank` on the `DesignationTitle` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `DesignationTitle` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DesignationTitle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titleName" TEXT NOT NULL,
    "titleCode" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "rankId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "salary" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_DesignationTitle" ("createdAt", "description", "id", "isActive", "isNew", "rankId", "salary", "shortCode", "titleCode", "titleName") SELECT "createdAt", "description", "id", "isActive", "isNew", "rankId", "salary", "shortCode", "titleCode", "titleName" FROM "DesignationTitle";
DROP TABLE "DesignationTitle";
ALTER TABLE "new_DesignationTitle" RENAME TO "DesignationTitle";
CREATE UNIQUE INDEX "DesignationTitle_titleCode_key" ON "DesignationTitle"("titleCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
