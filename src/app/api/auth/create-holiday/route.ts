import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create a new holiday
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      holidayCode,
      holidayName,
      date,
      type,
      applicableBranches,
      description,
      status,
      addedBy,
      remarks
    } = data;

    const holiday = await prisma.holiday.create({
      data: {
        holidayCode,
        holidayName,
        date,
        type,
        applicableBranches,
        description,
        status,
        addedBy,
        remarks
      }
    });

    return NextResponse.json({ message: "Holiday created successfully", data: holiday }, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create holiday:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Retrieve all holidays
export async function GET() {
  try {
    const holidays = await prisma.holiday.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(holidays, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch holidays:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
