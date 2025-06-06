-- CreateTable
CREATE TABLE "Salesperson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "salesCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "addedBy" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Salesperson_salesCode_key" ON "Salesperson"("salesCode");

-- CreateIndex
CREATE UNIQUE INDEX "Salesperson_phone_key" ON "Salesperson"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Salesperson_email_key" ON "Salesperson"("email");
