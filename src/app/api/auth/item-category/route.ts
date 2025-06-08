import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all item categories
export async function GET() {
  try {
    const categories = await prisma.itemCategory.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET /api/category error:", error);
    return NextResponse.json(
      { message: "Failed to fetch item categories." },
      { status: 500 }
    );
  }
}

// POST: Create a new item category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      categoryName,
      categoryCode,
      description,
      type,
      unitOfMeasure,
      tags,
      isActive,
    } = body;

    // Validate required fields
    if (!categoryName || !categoryCode || !type || !unitOfMeasure) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const existing = await prisma.itemCategory.findUnique({
      where: { categoryCode },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Category code already exists." },
        { status: 409 }
      );
    }

    const newCategory = await prisma.itemCategory.create({
      data: {
        categoryName,
        categoryCode,
        description,
        type,
        unitOfMeasure,
        tags,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("POST /api/category error:", error);
    return NextResponse.json(
      { message: "Failed to create item category." },
      { status: 500 }
    );
  }
}
