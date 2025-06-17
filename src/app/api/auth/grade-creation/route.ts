import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create a new Grade
export async function POST(req: NextRequest) {
  try {
    const {
      code,
      gradeName,
      description,
      qualityLevel,
      materialQuality,
      condition,
      isActive,
    } = await req.json();

    const newGrade = await prisma.grade.create({
      data: {
        code,
        gradeName,
        description,
        qualityLevel,
        materialQuality,
        condition,
        isActive,
      },
    });

    return NextResponse.json(newGrade, { status: 201 });
  } catch (error) {
    console.error("Error creating grade:", error);
    return NextResponse.json(
      { error: "Failed to create grade" },
      { status: 500 }
    );
  }
}

// GET: Fetch all grades
export async function GET() {
  try {
    const grades = await prisma.grade.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(grades, { status: 200 });
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      { error: "Failed to fetch grades" },
      { status: 500 }
    );
  }
}
