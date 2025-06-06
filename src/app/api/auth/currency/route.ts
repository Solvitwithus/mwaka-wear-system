import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create a new currency
export async function POST(req: NextRequest) {
  try {
    const {
      currencyName,
      currencySymbol,
      currencyCode,
      currencyFormat,
      decimalPlaces,
      thousandSeparator,
      KSHtoUSDExchange,
      allowedforTransactions,
    } = await req.json();

    if (!currencyName || !currencyFormat) {
      return NextResponse.json(
        { error: "Can't have missing values" },
        { status: 400 }
      );
    }

    const created = await prisma.currency.create({
      data: {
        currencyName,
        currencySymbol,
        currencyCode,
        currencyFormat,
        decimalPlaces,
        thousandSeparator,
        KSHtoUSDExchange,
        allowedforTransactions,
      },
    });

    return NextResponse.json(
      { message: "Currency created successfully", currency: created },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/currency error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// GET: Fetch all currencies
export async function GET() {
  try {
    const currencies = await prisma.currency.findMany();
    return NextResponse.json(currencies, { status: 200 });
  } catch (error) {
    console.error("GET /api/auth/currency error:", error);
    return NextResponse.json({ error: "Failed to fetch currencies" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
