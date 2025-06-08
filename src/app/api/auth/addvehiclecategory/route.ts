import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma"; // or just "prisma" if you're using @prisma/client

const prisma = new PrismaClient();

// GET: Fetch all vehicle categories
export async function GET() {
  try {
    const categories = await prisma.vehicleCategory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch vehicle categories" },
      { status: 500 }
    );
  }
}

// POST: Create a new vehicle category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      categoryName,
      description,
      maxLoad,
      type,
      isActive = true,
    } = body;

    const newCategory = await prisma.vehicleCategory.create({
      data: {
        categoryName,
        description,
        maxLoad,
        type,
        isActive,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle category:", error);
    return NextResponse.json(
      { message: "Failed to create vehicle category" },
      { status: 500 }
    );
  }
}
