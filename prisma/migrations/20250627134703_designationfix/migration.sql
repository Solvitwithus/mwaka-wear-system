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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DesignationTitle_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DesignationTitle_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DesignationTitle" ("createdAt", "departmentId", "description", "id", "isActive", "isNew", "rankId", "salary", "shortCode", "titleCode", "titleName") SELECT "createdAt", "departmentId", "description", "id", "isActive", "isNew", "rankId", "salary", "shortCode", "titleCode", "titleName" FROM "DesignationTitle";
DROP TABLE "DesignationTitle";
ALTER TABLE "new_DesignationTitle" RENAME TO "DesignationTitle";
CREATE UNIQUE INDEX "DesignationTitle_titleCode_key" ON "DesignationTitle"("titleCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
