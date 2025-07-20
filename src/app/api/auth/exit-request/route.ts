import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma"; // Adjust if needed

const prisma = new PrismaClient();

// POST: Create new exit request
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      employeeId,
      reasonToExit,
      exitDate,
      exitInterview,
      knowledgeTransferPlan,
      documentUrl,
    } = body;

    const newRequest = await prisma.exitRequest.create({
      data: {
        employeeId,
        reasonToExit,
        exitDate: new Date(exitDate),
        exitInterview,
        knowledgeTransferPlan,
        documentUrl,
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("POST /exit-request error:", error);
    return NextResponse.json({ error: "Failed to create exit request" }, { status: 500 });
  }
}

// GET: Retrieve all exit requests
export async function GET() {
  try {
    const requests = await prisma.exitRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("GET /exit-request error:", error);
    return NextResponse.json({ error: "Failed to fetch exit requests" }, { status: 500 });
  }
}
