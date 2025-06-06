import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all sales categories
export async function GET() {
  try {
    const categories = await prisma.salesCategory.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching sales categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create a new sales category
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newCategory = await prisma.salesCategory.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        priceAdjustmentType: data.priceAdjustmentType,
        priceAdjustment: data.priceAdjustment,
        allowCredit: data.allowCredit,
        creditLimit: data.creditLimit,
        defaultPaymentTerm: data.defaultPaymentTerm,
        applicableChannels: data.applicableChannels,
        isActive: data.isActive,
        remarks: data.remarks,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating sales category:", error);
    return NextResponse.json({ error: "Failed to create sales category" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
