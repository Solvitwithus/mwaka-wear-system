/*
  Warnings:

  - Made the column `contractStartDate` on table `Trainer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contractEndDate` on table `Trainer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Trainer_email_key";

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "contractStartDate" SET NOT NULL,
ALTER COLUMN "contractEndDate" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Active';
