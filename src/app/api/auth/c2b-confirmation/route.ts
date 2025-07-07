// export const runtime = {
//   api: {
//     bodyParser: false,
//   },
//   runtime: 'nodejs',
// };

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    console.log("📥 Incoming C2B Confirmation");

    const contentType = req.headers.get("content-type");
    console.log("📌 Content-Type:", contentType);

    const rawBody = await req.text();
    console.log("🔍 Raw body from Safaricom:", rawBody);

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (err) {
      console.error("❌ Failed to parse Safaricom payload as JSON:", err);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const {
      TransID,
      TransAmount,
      MSISDN,
      TransTime,
    } = body;

    if (!TransID || !TransAmount || !MSISDN || !TransTime) {
      console.warn("⚠️ Missing required fields:", body);
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const formattedTime = new Date(
      `${TransTime.substring(0, 4)}-${TransTime.substring(4, 6)}-${TransTime.substring(6, 8)}T${TransTime.substring(8, 10)}:${TransTime.substring(10, 12)}:${TransTime.substring(12, 14)}`
    );

    console.log("🧾 Parsed Data:", {
      TransID,
      TransAmount,
      MSISDN,
      formattedTime
    });

    // Save to DB
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

export async function GET() {
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
