-- CreateTable
CREATE TABLE "PurchaseReQEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "grandTotal" REAL NOT NULL,
    "remarks" TEXT,
    "shipping" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "supplierId" TEXT NOT NULL,
    "purchaseAdditionalInfoId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PurchaseReQEntry_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PurchaseRequisitionEntryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "discount" REAL NOT NULL,
    "tax" REAL NOT NULL,
    "total" REAL NOT NULL,
    "purchaseReQEntryId" TEXT NOT NULL,
    CONSTRAINT "PurchaseRequisitionEntryItem_purchaseReQEntryId_fkey" FOREIGN KEY ("purchaseReQEntryId") REFERENCES "PurchaseReQEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PurchaseAdditionalInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment" TEXT,
    "deliverTo" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "isUrgent" BOOLEAN NOT NULL,
    "prepay" BOOLEAN NOT NULL,
    "reqDate" DATETIME NOT NULL,
    "offload" BOOLEAN NOT NULL,
    "isDelivered" BOOLEAN NOT NULL,
    "purchaseReQEntryId" TEXT,
    CONSTRAINT "PurchaseAdditionalInfo_purchaseReQEntryId_fkey" FOREIGN KEY ("purchaseReQEntryId") REFERENCES "PurchaseReQEntry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseAdditionalInfo_purchaseReQEntryId_key" ON "PurchaseAdditionalInfo"("purchaseReQEntryId");
