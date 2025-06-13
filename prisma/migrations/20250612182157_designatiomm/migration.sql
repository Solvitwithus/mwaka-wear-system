-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Salesperson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "salesCode" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL DEFAULT '',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL,
    "phone2" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "region" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "idNumber" TEXT NOT NULL DEFAULT '',
    "salesArea" TEXT NOT NULL DEFAULT '',
    "salesType" TEXT NOT NULL DEFAULT '',
    "branchOffice" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "employmentType" TEXT NOT NULL DEFAULT '',
    "supervisor" TEXT NOT NULL DEFAULT '',
    "salesTarget" REAL NOT NULL DEFAULT 0,
    "salesCommission" REAL NOT NULL DEFAULT 0,
    "allowDiscount" BOOLEAN NOT NULL DEFAULT false,
    "addedBy" TEXT NOT NULL DEFAULT '',
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Salesperson" ("addedBy", "address", "createdAt", "email", "firstName", "gender", "id", "lastName", "phone", "region", "remarks", "salesCode", "status", "updatedAt") SELECT "addedBy", "address", "createdAt", "email", "firstName", "gender", "id", "lastName", "phone", "region", "remarks", "salesCode", "status", "updatedAt" FROM "Salesperson";
DROP TABLE "Salesperson";
ALTER TABLE "new_Salesperson" RENAME TO "Salesperson";
CREATE UNIQUE INDEX "Salesperson_salesCode_key" ON "Salesperson"("salesCode");
CREATE UNIQUE INDEX "Salesperson_employeeCode_key" ON "Salesperson"("employeeCode");
CREATE UNIQUE INDEX "Salesperson_phone_key" ON "Salesperson"("phone");
CREATE UNIQUE INDEX "Salesperson_email_key" ON "Salesperson"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
