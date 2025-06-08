import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all units of measure
export async function GET() {
  try {
    const units = await prisma.unitOfMeasure.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(units, { status: 200 });
  } catch (error) {
    console.error("GET /unit-of-measure error:", error);
    return NextResponse.json(
      { message: "Failed to fetch units." },
      { status: 500 }
    );
  }
}

// POST: Create a new unit of measure
export async function POST(req: Request) {
  try {
    const {
      unitName,
      abbreviation,
      description,
      conversionFactor,
      isBaseUnit,
      isActive,
    } = await req.json();

    if (!unitName || !abbreviation || !conversionFactor) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const newUnit = await prisma.unitOfMeasure.create({
      data: {
        unitName,
        abbreviation,
        description,
        conversionFactor: parseFloat(conversionFactor),
        isBaseUnit: isBaseUnit ?? false,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(newUnit, { status: 201 });
  } catch (error) {
    console.error("POST /unit-of-measure error:", error);
    return NextResponse.json(
      { message: "Failed to create unit." },
      { status: 500 }
    );
  }
}
