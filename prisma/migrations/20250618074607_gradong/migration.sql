-- CreateTable
CREATE TABLE "GradingSheet" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GradedItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "qtyToHold" INTEGER,
    "sellingPrice" REAL NOT NULL,
    "gradingSheetId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GradedItem_gradingSheetId_fkey" FOREIGN KEY ("gradingSheetId") REFERENCES "GradingSheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
