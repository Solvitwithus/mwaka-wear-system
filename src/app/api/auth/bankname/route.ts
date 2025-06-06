import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create new bank
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      bankName,
      bankCode,
      branchName,
      branchCode,
      BICCode,
      headOfficeAddress,
      country,
      email,
      phone1,
      phone2,
      website,
      status,
      addedBy,
      bankType,
      remarks,
    } = data;

    const newBank = await prisma.bankName.create({
      data: {
        bankCode,
        bankName,
        branchName,
        branchCode,
        BICCode,
        headOfficeAddress,
        country,
        email,
        phone1,
        phone2,
        website,
        status,
        addedBy,
        bankType,
        remarks,
      },
    });

    return NextResponse.json(newBank, { status: 201 });
  } catch (error) {
    console.error("Bank creation error:", error);
    return NextResponse.json(
      { error: "Failed to create bank record", details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET: Fetch all banks
export async function GET() {
  try {
    const banks = await prisma.bankName.findMany();
    return NextResponse.json(banks, { status: 200 });
  } catch (error) {
    console.error("Bank fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bank records", details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
