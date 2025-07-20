import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma"; // or from "@prisma/client" if not custom

const prisma = new PrismaClient();

// 🚀 GET: All promotion requests
export async function GET() {
  try {
    const promotions = await prisma.promotionRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(promotions, { status: 200 });
  } catch (error) {
    console.error("[GET /promotion-request] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotion requests" },
      { status: 500 }
    );
  }
}

// 🚀 POST: Create a new promotion request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      employeeId,
      promotionReason,
      promotionDate,
      promotionDetails,
      performanceReview,
      documentUrl,
    } = body;

    if (
      !employeeId ||
      !promotionReason ||
      !promotionDate ||
      !promotionDetails ||
      !performanceReview
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPromotion = await prisma.promotionRequest.create({
      data: {
        employeeId,
        promotionReason,
        promotionDate: new Date(promotionDate),
        promotionDetails,
        performanceReview,
        documentUrl,
        status: "pending", // optional default
      },
    });

    return NextResponse.json(newPromotion, { status: 201 });
  } catch (error) {
    console.error("[POST /promotion-request] Error:", error);
    return NextResponse.json(
      { error: "Failed to create promotion request" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, approver } = body;

    if (!id || !status || !approver) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updated = await prisma.promotionRequest.update({
      where: { id },
      data: {
        status,
        approver,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update promotion request" }, { status: 500 });
  }
}