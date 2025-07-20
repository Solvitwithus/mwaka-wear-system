import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET all transfer requests
export async function GET() {
  try {
    const transfers = await prisma.transferRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transfers, { status: 200 });
  } catch (error) {
    console.error("[GET /transfer-request] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transfer requests" },
      { status: 500 }
    );
  }
}

// POST new transfer request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      employeeId,
      transferReason,
      transferDate,
      transferInterview,
      knowledgeTransferPlan,
      documentUrl,
    } = body;

    // Basic validation
    if (
      !employeeId ||
      !transferReason ||
      !transferDate ||
      !transferInterview ||
      !knowledgeTransferPlan
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTransfer = await prisma.transferRequest.create({
      data: {
        employeeId,
        transferReason,
        transferDate: new Date(transferDate),
        transferInterview,
        knowledgeTransferPlan,
        documentUrl,
      },
    });

    return NextResponse.json(newTransfer, { status: 201 });
  } catch (error) {
    console.error("[POST /transfer-request] Error:", error);
    return NextResponse.json(
      { error: "Failed to create transfer request" },
      { status: 500 }
    );
  }
}
// PATCH update transfer request status and approver
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, approver } = body;

    if (!id || !status || !approver) {
      return NextResponse.json(
        { error: "Missing required fields: id, status, or approver" },
        { status: 400 }
      );
    }

    const updated = await prisma.transferRequest.update({
      where: { id },
      data: {
        status,
        approver,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[PATCH /transfer-request] Error:", error);
    return NextResponse.json(
      { error: "Failed to update transfer request" },
      { status: 500 }
    );
  }
}

