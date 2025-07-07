import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create a new priority level
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      priorityCode,
      priorityName,
      level,
      category,
      description,
      status,
      addedBy,
      remarks
    } = data;

    const priorityLevel = await prisma.priorityLevel.create({
      data: {
        priorityCode,
        priorityName,
        level,
        category,
        description,
        status,
        addedBy,
        remarks
      }
    });

    return NextResponse.json({ message: "Priority level created successfully", data: priorityLevel }, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create priority level:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Retrieve all priority levels
export async function GET() {
  try {
    const priorityLevels = await prisma.priorityLevel.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(priorityLevels, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch priority levels:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
