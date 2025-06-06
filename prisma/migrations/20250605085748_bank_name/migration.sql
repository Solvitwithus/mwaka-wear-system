-- CreateTable
CREATE TABLE "BankName" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bankName" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "branchCode" TEXT NOT NULL,
    "BICCode" TEXT NOT NULL,
    "headOfficeAddress" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "addedBy" TEXT NOT NULL,
    "bankType" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BankName_bankCode_key" ON "BankName"("bankCode");

-- CreateIndex
CREATE UNIQUE INDEX "BankName_branchCode_key" ON "BankName"("branchCode");

-- CreateIndex
CREATE UNIQUE INDEX "BankName_email_key" ON "BankName"("email");
