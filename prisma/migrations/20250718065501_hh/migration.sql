-- AlterTable
ALTER TABLE "TrainingRequest" ADD COLUMN     "finalApprover" TEXT,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;
