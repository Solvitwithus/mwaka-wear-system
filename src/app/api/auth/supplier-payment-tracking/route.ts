import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { purchaseEntryId, itemId, total, allocateAll } = await req.json();

    if (!purchaseEntryId || !itemId || !total) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingPayment = await prisma.supplierPaymentTracking.findFirst({
      where: { purchaseEntryId, itemId },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "Payment tracking already exists for this item" },
        { status: 409 }
      );
    }

    const payment = await prisma.supplierPaymentTracking.create({
      data: {
        purchaseEntryId,
        itemId,
        totalAmount: total,
        allocatedAmount: allocateAll || 0,
        balance: total - (allocateAll || 0),
      },
    });

    return NextResponse.json(
      { message: "Allocation created successfully", data: payment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating allocation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { itemId, partialAllocation } = await req.json();

    if (!itemId || partialAllocation === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payment = await prisma.supplierPaymentTracking.findFirst({
      where: { itemId },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment tracking not found" },
        { status: 404 }
      );
    }

    const updatedPayment = await prisma.supplierPaymentTracking.update({
      where: { id: payment.id },
      data: {
        allocatedAmount: payment.allocatedAmount + partialAllocation,
        balance: payment.totalAmount - (payment.allocatedAmount + partialAllocation),
      },
    });

    return NextResponse.json(
      { message: "Partial allocation updated successfully", data: updatedPayment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating partial allocation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const purchaseEntryId = searchParams.get("purchaseEntryId");
    const itemId = searchParams.get("itemId");

    const whereClause: any = {};
    if (purchaseEntryId) whereClause.purchaseEntryId = purchaseEntryId;
    if (itemId) whereClause.itemId = itemId;

    const payments = await prisma.supplierPaymentTracking.findMany({
      where: whereClause,
    });

    return NextResponse.json(
      { message: "Payments retrieved successfully", data: payments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving payments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}