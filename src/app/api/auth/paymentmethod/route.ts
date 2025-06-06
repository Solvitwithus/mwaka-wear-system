// /api/auth/paymentmethod/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all payment methods
export async function GET() {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany();
    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create a new payment method
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newPaymentMethod = await prisma.paymentMethod.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        supportedTypes: data.supportedTypes,
        isActive: data.isActive,
        notes: data.notes,
      },
    });

    return NextResponse.json(newPaymentMethod, { status: 201 });
  } catch (error) {
    console.error("Error creating payment method:", error);
    return NextResponse.json({ error: "Failed to create payment method" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
