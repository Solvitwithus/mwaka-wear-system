-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "policyTitle" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "policyCategory" TEXT NOT NULL,
    "effectiveDate" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "policyRules" TEXT NOT NULL,
    "consequences" TEXT NOT NULL,
    "applicableDepartments" TEXT[],
    "applicableBranches" TEXT[],
    "rolesAffected" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Policy_code_key" ON "Policy"("code");
