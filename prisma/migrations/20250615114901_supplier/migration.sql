-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone2" TEXT,
    "country" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "kra" TEXT NOT NULL,
    "vat" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankCode" TEXT,
    "accountNumber" TEXT NOT NULL,
    "preferredPaymentMethod" TEXT NOT NULL,
    "paymentTerm" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "creditLimit" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "website" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_code_key" ON "Supplier"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "Supplier"("email");
