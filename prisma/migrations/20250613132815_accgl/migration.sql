-- CreateTable
CREATE TABLE "VehicleGeneralLedgerAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "glAccountCode" TEXT NOT NULL,
    "glAccountName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "isPrimaryAccount" BOOLEAN NOT NULL,
    "effectiveFrom" DATETIME NOT NULL,
    "openingBalance" REAL NOT NULL,
    "remarks" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverUserName" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VehicleGeneralLedgerAccount_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "VehicleGeneralLedgerAccount_glAccountCode_key" ON "VehicleGeneralLedgerAccount"("glAccountCode");
