// /app/api/auth/mpesa/validation/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 M-Pesa Validation received:", body);

    // Respond with success to approve the transaction
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Validation accepted"
    });
  } catch (error) {
    console.error("❌ Error handling validation:", error);
    return NextResponse.json({
      ResultCode: 1,
      ResultDesc: "Validation failed"
    });
  }
}
