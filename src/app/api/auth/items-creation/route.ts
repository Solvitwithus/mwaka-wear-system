import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.item.findMany();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("GET /items error:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Basic validation (you can add more)
    if (!data.name || !data.code || !data.category || !data.unitOfMeasure || !data.branch || !data.creator || !data.status || !data.barcode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newItem = await prisma.item.create({
      data: {
        code: data.code,
        name: data.name,
        category: data.category,
        unitOfMeasure: data.unitOfMeasure,
        description: data.description ?? null,
        excludeFromSale: data.excludeFromSale ?? false,
        excludeFromPurchase: data.excludeFromPurchase ?? false,
        branch: data.branch,
        creator: data.creator,
        status: data.status,
        barcode: data.barcode,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("POST /items error:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
