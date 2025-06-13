import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all active credit statuses
export async function GET() {
  try {
    const statuses = await prisma.creditStatus.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: statuses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching credit statuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit statuses" },
      { status: 500 }
    );
  }
}

// POST: Create a new credit status
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      code,
      statusName,
      description,
      category,
      defaultStatus,
      isFinalStatus,
      isActive,
      remarks,
    } = body;

    // Basic validation
    if (!code || !statusName || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newStatus = await prisma.creditStatus.create({
      data: {
        code,
        statusName,
        description,
        category,
        defaultStatus,
        isFinalStatus,
        isActive,
        remarks,
      },
    });

    return NextResponse.json(
      {
        message: "Credit status created successfully",
        data: newStatus,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating credit status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
