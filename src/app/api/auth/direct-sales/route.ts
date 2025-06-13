import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

type DirectSaleItemInput = {
  itemId?: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  discount?: number;
  tax?: number;
};

// GET: Fetch all direct sales
export async function GET() {
  try {
    const sales = await prisma.directSale.findMany({
      where:{
         deliveryDetails: {
      prepay: false,
    },
      },
      include: {
        client: true,
        deliveryDetails: true,
        saleItems: true,
      },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error fetching direct sales:", error);
    return new NextResponse("Failed to fetch direct sales", { status: 500 });
  }
}

// POST: Create a new direct sale
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      clientId,
      deliveryDetails,
      directSaleItem,
      subtotal,
      shipping,
      grandTotal,
      remarks,
      status,
    } = body;

    if (!clientId || !deliveryDetails || !directSaleItem || !directSaleItem.length) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create delivery detail
    const createdDeliveryDetail = await prisma.deliveryDetail.create({
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
        prepay:deliveryDetails.prepay,
        offload:deliveryDetails.offload
      },
    });

    // Create direct sale
    const createdDirectSale = await prisma.directSale.create({
      data: {
        clientId,
        deliveryDetailsId: createdDeliveryDetail.id,
        subtotal,
        shipping,
        grandTotal,
        remarks,
        status: status || "Completed",
        saleItems: {
          create: (directSaleItem as DirectSaleItemInput[]).map(item => ({
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            discount: item.discount ?? 0,
            tax: item.tax ?? 0,
          })),
        },
      },
      include: {
        client: true,
        deliveryDetails: true,
        saleItems: true,
      },
    });

    return NextResponse.json({message:"Successfully posted a diect Sale"}, { status: 201 });
  } catch (err) {
    console.error("Error creating direct sale:", err);
    return NextResponse.json({ error: "Failed to create direct sale" }, { status: 500 });
  }
}
