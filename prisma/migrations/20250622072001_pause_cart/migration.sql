-- CreateTable
CREATE TABLE "PausedCart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PausedCartItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pausedCartId" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "qty" INTEGER NOT NULL,
    "availableQty" INTEGER NOT NULL,
    CONSTRAINT "PausedCartItem_pausedCartId_fkey" FOREIGN KEY ("pausedCartId") REFERENCES "PausedCart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
