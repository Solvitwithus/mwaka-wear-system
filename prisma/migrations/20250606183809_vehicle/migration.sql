-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plateNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "yearOfManufacture" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "assignedBranch" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "initialOdometerReading" TEXT NOT NULL,
    "ownershipType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
