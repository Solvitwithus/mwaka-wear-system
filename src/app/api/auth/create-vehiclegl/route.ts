import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET all GL accounts
export async function GET() {
  try {
    const accounts = await prisma.vehicleGeneralLedgerAccount.findMany({
      include: {
        vehicle: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "Failed to fetch accounts" }, { status: 500 });
  }
}

// POST a new GL account
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      glAccountCode,
      glAccountName,
      accountType,
      currencyCode,
      description,
      isActive,
      isDefault,
      isPrimaryAccount,
      effectiveFrom,
      openingBalance,
      remarks,
      vehicleId,
      driverUserName,
      licenseNumber,
    } = body;

    const newAccount = await prisma.vehicleGeneralLedgerAccount.create({
      data: {
        glAccountCode,
        glAccountName,
        accountType,
        currencyCode,
        description,
        isActive,
        isDefault,
        isPrimaryAccount,
        effectiveFrom: new Date(effectiveFrom),
        openingBalance: parseFloat(openingBalance),
        remarks,
        vehicleId,
        driverUserName,
        licenseNumber,
      },
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ message: "Failed to create account" }, { status: 500 });
  }
}
