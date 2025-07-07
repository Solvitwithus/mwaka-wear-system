import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST /api/auth/create-policy
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      policyTitle,
      code,
      policyCategory,
      effectiveDate,
      purpose,
      scope,
      policyRules,
      consequences,
      applicableDepartments,
      applicableBranches,
      rolesAffected,
      comment
    } = body;

    const policy = await prisma.policy.create({
      data: {
        policyTitle,
        code,
        policyCategory,
        effectiveDate,
        purpose,
        scope,
        policyRules,
        consequences,
        applicableDepartments,
        applicableBranches,
        rolesAffected,
        comment
      }
    });

    return NextResponse.json({ message: "Policy created", data: policy }, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create policy:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET /api/auth/create-policy
export async function GET() {
  try {
    const policies = await prisma.policy.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(policies, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch policies:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
