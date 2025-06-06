import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create a new Payment Term
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const newPaymentTerm = await prisma.paymentTerm.create({
      data: {
        name: data.name,
        description: data.description || "",
        totalDuration: data.totalDuration,
        numInstallments: data.numInstallments,
        installments: data.installments,
        startDateRule: data.startDateRule,
        gracePeriod: data.gracePeriod,
        lateFeeEnabled: data.lateFeeEnabled,
        lateFeeType: data.lateFeeType,
        lateFeeAmount: data.lateFeeAmount,
        lateFeeAfterDays: data.lateFeeAfterDays,
        earlyDiscountEnabled: data.earlyDiscountEnabled,
        earlyDiscountPercent: data.earlyDiscountPercent,
        earlyDiscountWithinDays: data.earlyDiscountWithinDays,
        allowedMethods: data.allowedMethods.join(","),
    applicableTo: data.applicableTo.join(","),
        isActive: data.isActive,
        notes: data.notes || "",
      },
    });

    return NextResponse.json(newPaymentTerm, { status: 201 });
  } catch (error) {
    console.error("Error creating payment term:", error);
    return NextResponse.json({ error: "Failed to create payment term." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// GET: Fetch all Payment Terms
export async function GET() {
  try {
    const terms = await prisma.paymentTerm.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(terms, { status: 200 });
  } catch (error) {
    console.error("Error fetching payment terms:", error);
    return NextResponse.json({ error: "Failed to fetch payment terms." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
