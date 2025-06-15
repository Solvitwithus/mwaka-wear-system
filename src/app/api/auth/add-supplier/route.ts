import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create Supplier
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      code,
      name,
      shortName,
      email,
      phone,
      phone2,
      country,
      county,
      town,
      address,
      kra,
      vat,
      bankName,
      bankCode,
      accountNumber,
      preferredPaymentMethod,
      paymentTerm,
      currency,
      taxType,
      creditLimit,
      isActive,
      blacklisted,
      remarks,
      website,
    } = body;

    const newSupplier = await prisma.supplier.create({
      data: {
        code,
        name,
        shortName,
        email,
        phone,
        phone2,
        country,
        county,
        town,
        address,
        kra,
        vat,
        bankName,
        bankCode,
        accountNumber,
        preferredPaymentMethod,
        paymentTerm,
        currency,
        taxType,
        creditLimit: parseFloat(creditLimit),
        isActive,
        blacklisted,
        remarks,
        website,
      },
    });

    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
  }
}

// GET: Fetch all Suppliers
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}
