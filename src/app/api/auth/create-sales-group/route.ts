import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all sales groups
export async function GET() {
  try {
    const groups = await prisma.salesGroup.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error("GET sales groups error:", error);
    return NextResponse.json({ message: "Failed to fetch sales groups" }, { status: 500 });
  }
}

// POST: Create a new sales group
export async function POST(req: Request) {
  try {
    const {
      code,
      groupName,
      groupType,
      description,
      defaultCommissionRate,
      allowCustomCommission,
      discountAllowed,
      salesTarget,
      isActive,
      remarks,
    } = await req.json();

    const newGroup = await prisma.salesGroup.create({
      data: {
        code,
        groupName,
        groupType,
        description,
        defaultCommissionRate: parseFloat(defaultCommissionRate),
        allowCustomCommission,
        discountAllowed: parseFloat(discountAllowed),
        salesTarget,
        isActive,
        remarks,
      },
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("POST sales group error:", error);
    return NextResponse.json({ message: "Failed to create sales group" }, { status: 500 });
  }
}
