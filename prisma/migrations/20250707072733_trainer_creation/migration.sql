-- CreateTable
CREATE TABLE "Trainer" (
    "id" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT,
    "website" TEXT,
    "gender" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "credentials" TEXT[],
    "experienceYears" INTEGER NOT NULL,
    "languages" TEXT[],
    "trainerType" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "ratePerSession" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "preferredMode" TEXT NOT NULL,
    "canTravel" BOOLEAN NOT NULL,
    "workingZones" TEXT[],
    "contractStartDate" TEXT,
    "contractEndDate" TEXT,
    "status" TEXT NOT NULL,
    "trainerProfile" TEXT,
    "remarks" TEXT,
    "portfolioLinks" TEXT[],
    "addedBy" TEXT NOT NULL,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_nationalId_key" ON "Trainer"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_email_key" ON "Trainer"("email");
