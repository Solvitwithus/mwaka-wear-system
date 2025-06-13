-- CreateTable
CREATE TABLE "DesignationTitle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titleName" TEXT NOT NULL,
    "titleCode" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "rankId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "salary" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "DesignationTitle_titleCode_key" ON "DesignationTitle"("titleCode");
