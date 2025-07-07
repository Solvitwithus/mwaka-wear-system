import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create a new leave type
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      leaveCode,
      leaveName,
      category,
      duration,
      applicableTo,
      description,
      status,
      addedBy,
      remarks
    } = data;

    const leaveType = await prisma.leaveType.create({
      data: {
        leaveCode,
        leaveName,
        category,
        duration,
        applicableTo,
        description,
        status,
        addedBy,
        remarks
      }
    });

    return NextResponse.json({ message: "Leave type created successfully", data: leaveType }, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create leave type:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Retrieve all leave types
export async function GET() {
  try {
    const leaveTypes = await prisma.leaveType.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(leaveTypes, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch leave types:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
