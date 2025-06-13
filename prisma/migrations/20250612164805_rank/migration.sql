-- CreateTable
CREATE TABLE "Rank" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rankName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "description" TEXT,
    "rankLevel" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdDate" DATETIME NOT NULL
);
