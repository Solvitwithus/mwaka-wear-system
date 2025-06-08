-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "description" TEXT,
    "excludeFromSale" BOOLEAN NOT NULL DEFAULT false,
    "excludeFromPurchase" BOOLEAN NOT NULL DEFAULT false,
    "branch" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_code_key" ON "Item"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Item_barcode_key" ON "Item"("barcode");
