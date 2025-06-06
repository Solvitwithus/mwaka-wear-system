-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currencyName" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "currencyFormat" TEXT NOT NULL,
    "decimalPlaces" TEXT NOT NULL,
    "thousandSeparator" TEXT NOT NULL,
    "KSHtoUSDExchange" TEXT NOT NULL,
    "allowedforTransactions" BOOLEAN NOT NULL
);
