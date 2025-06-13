import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Utility to generate a unique code
function generateUniqueCode(prefix: string = ""): string {
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${randomStr}${timestamp}`;
}

// POST: Create new salesperson
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      salesCode,
      employeeCode,
      firstName,
      lastName,
      gender,
      phone,
      phone2,
      email,
      address,
      region,
      country,
      idNumber,
      salesArea,
      salesType,
      branchOffice,
      status,
      employmentType,
      supervisor,
      salesTarget,
      salesCommission,
      allowDiscount,
      addedBy,
      remarks,
    } = data;

    // Use provided codes or generate new ones
    const finalSalesCode = salesCode || generateUniqueCode("SLP");
    const finalEmployeeCode = employeeCode || generateUniqueCode("EMP");

    const newSalesperson = await prisma.salesperson.create({
      data: {
        salesCode: finalSalesCode,
        employeeCode: finalEmployeeCode,
        firstName,
        lastName,
        gender,
        phone,
        phone2: phone2 || null,
        email,
        address,
        region,
        country,
        idNumber,
        salesArea,
        salesType,
        branchOffice,
        status,
        employmentType,
        supervisor,
        salesTarget: Number(salesTarget),
        salesCommission: Number(salesCommission),
        allowDiscount,
        addedBy,
        remarks: remarks || null,
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