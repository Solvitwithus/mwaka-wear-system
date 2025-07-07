import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create a new exit reason
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

    const reason = await prisma.exitReason.create({
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

    return NextResponse.json({ message: "Exit reason created successfully", data: reason }, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create exit reason:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Retrieve all exit reasons
export async function GET() {
  try {
    const reasons = await prisma.exitReason.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(reasons, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch exit reasons:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
