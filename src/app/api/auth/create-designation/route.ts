import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all designations
export async function GET() {
  try {
    const designations = await prisma.designationTitle.findMany({
      include: {
        department: true,
        rank: true,
      },
    });
    return NextResponse.json(designations);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Error fetching designations" }, { status: 500 });
  }
}

// POST: Create a new designation
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      titleName,
      titleCode,
      shortCode,
      departmentId,
      rankId,
      description,
      isActive,
      isNew,
      salary,
    } = data;

    const newDesignation = await prisma.designationTitle.create({
      data: {
        titleName,
        titleCode,
        shortCode,
        departmentId,
        rankId,
        description,
        isActive,
        isNew,
        salary: parseFloat(salary),
      },
    });

    return NextResponse.json(newDesignation, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: "Error creating designation" }, { status: 500 });
  }
}
