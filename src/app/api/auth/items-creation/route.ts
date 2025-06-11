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

    // Validate required fields
    const requiredFields = [
      "name",
      "code",
      "category",
      "unitOfMeasure",
      "branch",
      "creator",
      "status",
      "barcode",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
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
        itemPrice: data.itemPrice ?? 0,
        priceBeforeTax: data.priceBeforeTax ?? 0,
        taxAmount: data.taxAmount ?? 0,
        discountWholesale: data.discountWholesale ?? 0,
        discountRetail: data.discountRetail ?? 0,
        customDiscountAllowed: data.customDiscountAllowed ?? false,
        taxType: data.taxType ?? null,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error("POST /items error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create item" },
      { status: 500 }
    );
  }
}
