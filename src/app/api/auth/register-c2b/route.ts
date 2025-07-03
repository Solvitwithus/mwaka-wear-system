// /app/api/mpesa/register-c2b/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { getAccessToken } from "@/lib/mpesa"; // ✅ Correct import

export async function POST() {
  console.log("✅ C2B Registration Request Received");

  try {
    const token = await getAccessToken();

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",
      {
        ShortCode: process.env.MPESA_SHORTCODE,
        ResponseType: "Completed",
       ConfirmationURL:
  process.env.MPESA_CONFIRMATION_URL || "https://demo-script-cruise-erp.vercel.app/api/auth/c2b-confirmation",
ValidationURL:
  process.env.MPESA_VALIDATION_URL || "https://demo-script-cruise-erp.vercel.app/api/auth/validation",

      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, response: response.data });
  } catch (error: any) {
    console.error("❌ Register URL error:", error?.response?.data || error.message);
    return NextResponse.json({ error: "Failed to register confirmation URL" }, { status: 500 });
  }
}
