import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("GET /api/client error:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

// POST: Create a new client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newClient = await prisma.client.create({
      data: {
        customerName: body.customerName,
        customerInitials: body.customerInitials,
        address: body.address,
        kraPin: body.kraPin,
        currency: body.currency,
        isActive: body.isActive,
        phone1: body.phone1,
        phone2: body.phone2,
        email: body.email,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        salesPerson: body.salesPerson,
        discountEliginility: body.discountEliginility,
        branchName: body.branchName,
        salesArea: body.salesArea,
        salesType: body.salesType,
        comment: body.comment,
        customerId: body.customerId,
        preferedPaymentMethod: body.preferedPaymentMethod,
        sex: body.sex,
        allowedDiscount: body.allowedDiscount,
        creditLimit: body.creditLimit,
        paymentTerms: body.paymentTerms,
        refNo: body.refNo,
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error("POST /api/client error:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
