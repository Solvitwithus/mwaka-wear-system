/*
  Warnings:

  - You are about to drop the column `offloadPoint` on the `DeliveryDetail` table. All the data in the column will be lost.
  - You are about to drop the column `offloadTime` on the `DeliveryDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuotationItem" ADD COLUMN "itemId" TEXT;
ALTER TABLE "QuotationItem" ADD COLUMN "tax" REAL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DeliveryDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "deliveryDate" DATETIME NOT NULL,
    "deliveryFrom" TEXT,
    "destination" TEXT,
    "customerReference" TEXT,
    "comment" TEXT,
    "phoneNumber" TEXT,
    "accompaniedBy" TEXT
);
INSERT INTO "new_DeliveryDetail" ("accompaniedBy", "address", "comment", "customerReference", "deliveryDate", "deliveryFrom", "destination", "driverId", "id", "phoneNumber", "shiftId", "vehicleId") SELECT "accompaniedBy", "address", "comment", "customerReference", "deliveryDate", "deliveryFrom", "destination", "driverId", "id", "phoneNumber", "shiftId", "vehicleId" FROM "DeliveryDetail";
DROP TABLE "DeliveryDetail";
ALTER TABLE "new_DeliveryDetail" RENAME TO "DeliveryDetail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
