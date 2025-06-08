import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all taxes
export async function GET() {
  try {
    const taxes = await prisma.tax.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(taxes, { status: 200 });
  } catch (error) {
    console.error("Error fetching taxes:", error);
    return NextResponse.json({ error: "Failed to fetch taxes" }, { status: 500 });
  }
}

// POST: Create a new tax
export async function POST(request: NextRequest) {
  try {
    const {
      name,
      code,
      description,
      chargeType,
      lowerLimit,
      upperLimit,
      rate,
      fixedAmount,
      reliefApplicable,
      effectiveFrom,
      branch,
      creator,
      status,
    } = await request.json();

    const newTax = await prisma.tax.create({
      data: {
        name,
        code,
        description,
        chargeType,
        lowerLimit,
        upperLimit,
        rate,
        fixedAmount,
        reliefApplicable,
        effectiveFrom: new Date(effectiveFrom),
        branch,
        creator,
        status,
      },
    });

    return NextResponse.json(newTax, { status: 201 });
  } catch (error) {
    console.error("Error creating tax:", error);
    return NextResponse.json({ error: "Failed to create tax" }, { status: 500 });
  }
}
