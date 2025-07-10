-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "candidateCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL,
    "coverLetter" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "graduationYear" TIMESTAMP(3) NOT NULL,
    "highestEducation" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "resumeLink" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "workExperience" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_candidateCode_key" ON "Candidate"("candidateCode");
