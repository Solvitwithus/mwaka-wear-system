// File: app/api/prepayment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { salesEntryId, itemId, total, allocateAll } = await req.json();

    if (!salesEntryId || !itemId || allocateAll == null || total == null) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const balance = total - allocateAll;

    const allocation = await prisma.prepaymentAllocation.create({
      data: {
        salesEntryId,
        itemId,
        total,
        allocateAll,
        balance,
      },
    });

    return NextResponse.json({ success: true, data: allocation });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { itemId, partialAllocation } = await req.json();

    const existing = await prisma.prepaymentAllocation.findFirst({
      where: { itemId },
    });

    if (!existing) {
      return NextResponse.json({ message: "Allocation not found" }, { status: 404 });
    }

    const newPartial = existing.partialAllocation + partialAllocation;
    const newBalance = existing.total - (existing.allocateAll + newPartial);

    const updated = await prisma.prepaymentAllocation.updateMany({
      where: { itemId },
      data: {
        partialAllocation: newPartial,
        balance: newBalance,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({ message: "Missing itemId" }, { status: 400 });
    }

    const allocation = await prisma.prepaymentAllocation.findFirst({
      where: { itemId },
    });

    if (!allocation) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: allocation });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
