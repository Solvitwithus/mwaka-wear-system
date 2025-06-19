-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GradingSheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "baleName" TEXT NOT NULL,
    "baleWeight" REAL NOT NULL,
    "branch" TEXT NOT NULL,
    "comment" TEXT,
    "damageCount" INTEGER NOT NULL,
    "damageWeight" REAL NOT NULL,
    "gradeDate" DATETIME NOT NULL,
    "gradeReference" TEXT NOT NULL,
    "grader" TEXT NOT NULL,
    "itemCount" INTEGER NOT NULL,
    "itemtoGrade" TEXT,
    "unpairedCount" INTEGER NOT NULL,
    "workCenter" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Thrift',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GradingSheet" ("baleName", "baleWeight", "branch", "comment", "createdAt", "damageCount", "damageWeight", "gradeDate", "gradeReference", "grader", "id", "itemCount", "itemtoGrade", "unpairedCount", "updatedAt", "workCenter") SELECT "baleName", "baleWeight", "branch", "comment", "createdAt", "damageCount", "damageWeight", "gradeDate", "gradeReference", "grader", "id", "itemCount", "itemtoGrade", "unpairedCount", "updatedAt", "workCenter" FROM "GradingSheet";
DROP TABLE "GradingSheet";
ALTER TABLE "new_GradingSheet" RENAME TO "GradingSheet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
