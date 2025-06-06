import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Utility to generate a unique salesperson code
function generateSalesCode(): string {
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `SLP${randomStr}${timestamp}`;
}

// POST: Create new salesperson
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      firstName,
      lastName,
      gender,
      phone,
      email,
      address,
      region,
      status,
      addedBy,
      remarks,
    } = data;

    const salesCode = generateSalesCode();

    const newSalesperson = await prisma.salesperson.create({
      data: {
        salesCode,
        firstName,
        lastName,
        gender,
        phone,
        email,
        address,
        region,
        status,
        addedBy,
        remarks,
      },
    });

    return NextResponse.json(newSalesperson, { status: 201 });
  } catch (error) {
    console.error("Salesperson creation error:", error);
    return NextResponse.json(
      { error: "Failed to create salesperson record", details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET: Fetch all salespersons
export async function GET() {
  try {
    const salespersons = await prisma.salesperson.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(salespersons, { status: 200 });
  } catch (error) {
    console.error("Salesperson fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch salesperson records", details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
