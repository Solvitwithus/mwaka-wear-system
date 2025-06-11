-- CreateTable
CREATE TABLE "QuotationItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quotationId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "discount" REAL,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuotationItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "SalesQuotation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SalesQuotation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quotationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "deliveryDetailsId" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "shipping" REAL NOT NULL,
    "grandTotal" REAL NOT NULL,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SalesQuotation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SalesQuotation_deliveryDetailsId_fkey" FOREIGN KEY ("deliveryDetailsId") REFERENCES "DeliveryDetail" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeliveryDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "offloadPoint" TEXT NOT NULL,
    "offloadTime" TEXT NOT NULL,
    "deliveryDate" DATETIME NOT NULL,
    "deliveryFrom" TEXT,
    "destination" TEXT,
    "customerReference" TEXT,
    "comment" TEXT,
    "phoneNumber" TEXT,
    "accompaniedBy" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesQuotation_deliveryDetailsId_key" ON "SalesQuotation"("deliveryDetailsId");
