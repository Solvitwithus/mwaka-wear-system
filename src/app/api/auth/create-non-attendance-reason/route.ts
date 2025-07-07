import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create non-attendance reason
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      reasonCode,
      reasonName,
      category,
      description,
      applicableTo,
      status,
      addedBy,
      remarks
    } = data;

    const nonAttendanceReason = await prisma.nonAttendanceReason.create({
      data: {
        reasonCode,
        reasonName,
        category,
        description,
        applicableTo,
        status,
        addedBy,
        remarks
      }
    });

    return NextResponse.json({ message: "Non-attendance reason created successfully", data: nonAttendanceReason }, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create non-attendance reason:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Fetch all non-attendance reasons
export async function GET() {
  try {
    const reasons = await prisma.nonAttendanceReason.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(reasons, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch non-attendance reasons:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
