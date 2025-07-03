// app/api/mpesa/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    const rawBody = await req.text();

    const body = JSON.parse(rawBody);

    const {
      TransID,
      TransAmount,
      MSISDN,
      TransTime,
    } = body;

    const formattedTime = new Date(
      `${TransTime.substring(0, 4)}-${TransTime.substring(4, 6)}-${TransTime.substring(6, 8)}T${TransTime.substring(8, 10)}:${TransTime.substring(10, 12)}:${TransTime.substring(12, 14)}`
    );

    await prisma.payment.create({
      data: {
        mpesaReceipt: TransID,
        amount: parseFloat(TransAmount),
        phoneNumber: MSISDN,
        transactionTime: formattedTime,
        status: "paid"
      }
    });

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted"
    });

  } catch (error) {
    console.error("❌ Error handling C2B confirmation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
