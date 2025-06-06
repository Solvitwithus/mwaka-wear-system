import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create new sales area
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const newSalesArea = await prisma.salesArea.create({
      data: {
        code: data.code,
        name: data.name,
        region: data.region,
        county: data.county,
        zone: data.zone,
        headquarters: data.headquarters,
        areaManager: data.areaManager,
        phone: data.phone,
        email: data.email,
        status: data.status,
        remarks: data.remarks || "",
      },
    });

    return NextResponse.json(newSalesArea, { status: 201 });
  } catch (error) {
    console.error("Error creating sales area:", error);
    return NextResponse.json({ error: "Failed to create sales area." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// GET: List all sales areas
export async function GET() {
  try {
    const salesAreas = await prisma.salesArea.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(salesAreas, { status: 200 });
  } catch (error) {
    console.error("Error fetching sales areas:", error);
    return NextResponse.json({ error: "Failed to fetch sales areas." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
