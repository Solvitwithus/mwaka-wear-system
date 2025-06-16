import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create a new PurchaseReQEntry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
const {
  grandTotal,
  remarks,
  shipping,
  status,
  subtotal,
  supplierId,
  purchaseAdditionalInfo,
  PurchaseRequisitionEntryItems = [], // ← FIXED HERE
} = body;

    const created = await prisma.purchaseReQEntry.create({
      data: {
        grandTotal: parseFloat(grandTotal),
        remarks,
        shipping: parseFloat(shipping),
        status,
        subtotal: parseFloat(subtotal),
        supplier: { connect: { id: supplierId } },

        purchaseAdditionalInfo: purchaseAdditionalInfo
          ? {
              create: {
                comment: purchaseAdditionalInfo.comment,
                deliverTo: purchaseAdditionalInfo.deliverTo,
                dueDate: new Date(purchaseAdditionalInfo.dueDate),
                isUrgent:
                  purchaseAdditionalInfo.isUrgent === "on" ||
                  purchaseAdditionalInfo.isUrgent === true,
                prepay:
                  purchaseAdditionalInfo.prepay === "on" ||
                  purchaseAdditionalInfo.prepay === true,
                reqDate: new Date(purchaseAdditionalInfo.reqDate),
                offload: purchaseAdditionalInfo.offload === true,
                isDelivered:
                  purchaseAdditionalInfo.isDelivered === "on" ||
                  purchaseAdditionalInfo.isDelivered === true,
              },
            }
          : undefined,
items: {
  create: Array.isArray(PurchaseRequisitionEntryItems)
    ? PurchaseRequisitionEntryItems.map((item: any) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        discount: parseFloat(item.discount),
        tax: parseFloat(item.tax),
        total: parseFloat(item.total),
      }))
    : [],
},
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating PurchaseReQEntry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create entry." },
      { status: 500 }
    );
  }
}


// GET: Fetch all PurchaseReQEntries with related data
export async function GET() {
  try {
    const entries = await prisma.purchaseReQEntry.findMany({
      include: {
        supplier: true,
        purchaseAdditionalInfo: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: entries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching PurchaseReQEntries:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch entries." }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const updatedRequisition = await prisma.purchaseReQEntry.update({
      where: {  id },
      data: { status },
    });

    return NextResponse.json({ message: "Status updated successfully", data: updatedRequisition }, { status: 200 });
  } catch (error) {
    console.error("Error updating supplier requisition status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
