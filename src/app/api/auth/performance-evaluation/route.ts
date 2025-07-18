import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// --- POST: Create a new performance evaluation ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      employeeId,
      evaluationDate,
      evaluationTime,
      department,
      overallFeedback,
      goals,
      status,
      skills,
    } = body;

    const newEvaluation = await prisma.performanceEvaluation.create({
      data: {
        employeeId,
        evaluationDate: new Date(evaluationDate),
        evaluationTime,
        department,
        overallFeedback,
        goals,
        status,
        skills, // Stored as JSON
      },
    });

    return NextResponse.json(newEvaluation, { status: 201 });
  } catch (error) {
    console.error("Error creating performance evaluation:", error);
    return NextResponse.json(
      { message: "Failed to create performance evaluation", error },
      { status: 500 }
    );
  }
}

// --- GET: Fetch all performance evaluations ---
export async function GET() {
  try {
    const evaluations = await prisma.performanceEvaluation.findMany({
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(evaluations, { status: 200 });
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return NextResponse.json(
      { message: "Failed to fetch evaluations", error },
      { status: 500 }
    );
  }
}
