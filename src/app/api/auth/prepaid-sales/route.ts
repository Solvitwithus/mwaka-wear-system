import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
export async function GET() {
  try {
    const salesEntries = await prisma.salesEntry.findMany({
      where: {
         deliveryDetails: {
      prepay:true
    },
      },
      include: {
        client: true,
        deliveryDetails: true,
        salesEntryItems: true,
      },
      orderBy: {
        saleDate: "desc",
      },
    });
        return NextResponse.json({ data: salesEntries });
  } catch (error) {
    console.error("Error fetching sales entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales entries" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
 

    const { salesEntryId, status } = body;

    if (!salesEntryId || !status) {
      return NextResponse.json(
        { error: "salesEntryId and status are required." },
        { status: 400 }
      );
    }

    const updatedSalesEntry = await prisma.salesEntry.update({
      where: { id: salesEntryId },
      data: { status },
      include: {
        client: true,
        deliveryDetails: true,
        salesEntryItems: true,
      },
    });

    return NextResponse.json({
      message: "Sales entry status updated successfully.",
      data: updatedSalesEntry,
    });
  } catch (error) {
    console.error("Error updating sales entry:", error);
    return NextResponse.json(
      { error: "Failed to update sales entry status." },
      { status: 500 }
    );
  }
}
