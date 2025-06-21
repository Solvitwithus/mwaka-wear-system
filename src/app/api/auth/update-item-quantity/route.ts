// /api/auth/update-item-quantity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const { soldItems } = await req.json();

    for (const { itemCode, qty } of soldItems) {
      // Find the graded item by itemCode
      const item = await prisma.gradedItem.findFirst({
        where: { itemCode },
      });

      if (!item) continue; // skip if not found

      // Update qtyToDispatch
      await prisma.gradedItem.update({
        where: { id: item.id },
        data: {
          qtyToDispatch: {
            decrement: qty,
          },
        },
      });
    }

    return NextResponse.json({ message: "Quantities updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PATCH error - update-item-quantity:", error);
    return NextResponse.json({ error: "Failed to update quantities" }, { status: 500 });
  }
}
