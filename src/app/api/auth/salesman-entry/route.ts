
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all active sales entries with prepay=false
export async function GET() {
  try {
    const salesEntries = await prisma.salesEntry.findMany({
      where: {
        status: "Active",
        deliveryDetails: {
          prepay: false,
        },
      },
      include: {
        client: true,
        deliveryDetails: true,
        salesEntryItems: true,
        salesperson: true,
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

// POST: Create a new sales entry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("POST body:", body);

    const {
      clientId,
      deliveryDetails,
      salesEntryItems,
      subtotal,
      shipping,
      grandTotal,
      remarks,
      status,
      salesPerson, // expected to contain { salesPersonCode }
    } = body;

    // Extract salesperson code from nested object
    const salesPersonCode = salesPerson?.salesPersonCode;

    if (!salesPersonCode) {
      return NextResponse.json(
        { error: "Salesperson code is required." },
        { status: 400 }
      );
    }

    // Find salesperson by code
    const salesperson = await prisma.salesperson.findUnique({
      where: {
        employeeCode: salesPersonCode, // ✅ Adjust based on your actual field
      },
    });

    if (!salesperson) {
      return NextResponse.json(
        { error: `Salesperson with code '${salesPersonCode}' not found.` },
        { status: 404 }
      );
    }

    // Create delivery details first
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
        offload: deliveryDetails.offload,
        prepay: deliveryDetails.prepay,
      },
    });

    // Create the sales entry
    const newSalesEntry = await prisma.salesEntry.create({
      data: {
        clientId,
        deliveryDetailsId: createdDelivery.id,
        salespersonId: salesperson.id,
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
        salesperson: true,
      },
    });

    return NextResponse.json({
      message: "Sales entry created successfully.",
      data: newSalesEntry,
    });
  } catch (error) {
    console.error("Error creating sales entry:", error);
    return NextResponse.json(
      { error: "Failed to create sales entry." },
      { status: 500 }
    );
  }
}

// PATCH: Update sales entry status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("PATCH body:", body);

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
        salesperson: true,
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
