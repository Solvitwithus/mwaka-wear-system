import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all sales quotations with related data
export async function GET() {
  try {
    const quotations = await prisma.salesQuotation.findMany({
      include: {
        client: true,
        deliveryDetails: true,
        quotationItems: true,
      },
    });

    return NextResponse.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return new NextResponse("Failed to fetch quotations", { status: 500 });
  }
}

// POST: Create a new sales quotation with deliveryDetails and quotationItems
// POST: Create a new sales quotation with deliveryDetails and quotationItems
export async function POST(req: Request) {
  try {
    const body = await req.json();

console.log("body",body);

    const {
      clientId,
      deliveryDetails,
      quotationItems,
      subtotal,
      shipping,
      grandTotal,
      remarks,
      status,
    } = body;
    console.log(quotationItems);
    

    // Validate required fields
    if (!clientId || !deliveryDetails || !quotationItems || !quotationItems.length) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create the DeliveryDetail first
    const createdDeliveryDetail = await prisma.deliveryDetail.create({
      data: {
        address: deliveryDetails.address,
        shiftId: deliveryDetails.shiftId,
        driverId: deliveryDetails.driverId,
        vehicleId: deliveryDetails.vehicleId,
        deliveryDate: new Date(deliveryDetails.deliveryDate), // Ensure valid date

        // Optional fields
        deliveryFrom: deliveryDetails.deliveryFrom,
        destination: deliveryDetails.destination,
        customerReference: deliveryDetails.customerReference,
        comment: deliveryDetails.comment,
        phoneNumber: deliveryDetails.phoneNumber,
        accompaniedBy: deliveryDetails.accompaniedBy,
      },
    });

    // Create the SalesQuotation with related DeliveryDetail and QuotationItems
    const createdQuotation = await prisma.salesQuotation.create({
      data: {
        clientId,
        deliveryDetailsId: createdDeliveryDetail.id,
        subtotal,
        shipping,
        grandTotal,
        remarks,
        status: status || "Pending",
        quotationItems: {
          create: quotationItems.map((item: any) => ({
            itemId: item.itemId, // Ensure this matches your schema
            itemName:item.itemName,
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
        quotationItems: true,
      },
    });

    return NextResponse.json({message:"Successfully created sales quotation"},{ status: 201 });
  } catch (err) {
    console.error("Error creating sales quotation:", err);
    return NextResponse.json( {error:"failed to create quotation"}, {status: 500 });
    
  }
}