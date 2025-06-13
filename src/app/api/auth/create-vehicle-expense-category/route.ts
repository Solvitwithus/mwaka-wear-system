import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET all active vehicle expense categories
export async function GET() {
  try {
    const categories = await prisma.vehicleExpenseCategory.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST new vehicle expense category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      code,
      description,
      expenseAccount,
      tag,
      isRecurring,
      appliesToAllVehicles,
      amount,
      effectiveFrom,
      isActive,
      remarks,
    } = body;

    // Validate date
    const parsedDate = new Date(effectiveFrom);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ message: "Invalid effectiveFrom date" }, { status: 400 });
    }

    const newCategory = await prisma.vehicleExpenseCategory.create({
      data: {
        name,
        code,
        description,
        expenseAccount,
        tag,
        isRecurring,
        appliesToAllVehicles,
        amount:parseFloat(amount),
        effectiveFrom: parsedDate,
        isActive,
        remarks,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ message: "Failed to create category" }, { status: 500 });
  }
}