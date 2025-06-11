import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET all sales entries
export async function GET() {
  try {
    const salesEntries = await prisma.salesEntry.findMany({
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

// POST new sales entry with items and delivery details
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
console.log(body);

    const {
      clientId,
      deliveryDetails,
      salesEntryItems,
      subtotal,
      shipping,
      grandTotal,
      remarks,
      status,
    } = body;

    // 1. Create DeliveryDetail
    const createdDelivery = await prisma.deliveryDetail.create({
      data: {
        address: deliveryDetails.address,
        shiftId: deliveryDetails.shiftId,
        driverId: deliveryDetails.driverId,
        vehicleId: deliveryDetails.vehicleId,
        deliveryDate: new Date(deliveryDetails.deliveryDate),
        deliveryFrom: deliveryDetails.deliveryFrom,
        destination: deliveryDetails.destination,
        customerReference: deliveryDetails.customerReference,
        comment: deliveryDetails.comment,
        phoneNumber: deliveryDetails.phoneNumber,
        accompaniedBy: deliveryDetails.accompaniedBy,
      },
    });

    // 2. Create SalesEntry and nested SaleEntryItems
    const newSalesEntry = await prisma.salesEntry.create({
      data: {
        clientId,
        deliveryDetailsId: createdDelivery.id,
        subtotal,
        shipping,
        grandTotal,
        remarks,
        status: status ?? "Completed",
        salesEntryItems: {
          create: salesEntryItems.map((item: any) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            tax: item.tax,
            total: item.total,
          })),
        },
      },
      include: {
        client: true,
        deliveryDetails: true,
        salesEntryItems: true,
      },
    });

    return NextResponse.json({
      message: "Sales entry created successfully",
      data: newSalesEntry,
    });
  } catch (error) {
    console.error("Error creating sales entry:", error);
    return NextResponse.json(
      { error: "Failed to create sales entry" },
      { status: 500 }
    );
  }
}
