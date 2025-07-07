import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create a new shift
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      shiftCode,
      shiftName,
      startTime,
      endTime,
      days,
      assignedEmployees,
      branch,
      status,
      description,
      addedBy,
      remarks
    } = data;

    const shift = await prisma.workShift.create({
      data: {
        shiftCode,
        shiftName,
        startTime,
        endTime,
        days,
        assignedEmployees,
        branch,
        status,
        description,
        addedBy,
        remarks
      }
    });

    return NextResponse.json({ message: "Shift created successfully", data: shift }, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create shift:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Retrieve all shifts
export async function GET() {
  try {
    const shifts = await prisma.workShift.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(shifts, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch shifts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
