-- CreateTable
CREATE TABLE "ContractType" (
    "id" TEXT NOT NULL,
    "contractCode" TEXT NOT NULL,
    "contractName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "duration" INTEGER,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContractType_contractCode_key" ON "ContractType"("contractCode");
