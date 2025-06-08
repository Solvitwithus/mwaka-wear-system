-- CreateTable
CREATE TABLE "ItemCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryName" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "tags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemCategory_categoryCode_key" ON "ItemCategory"("categoryCode");
