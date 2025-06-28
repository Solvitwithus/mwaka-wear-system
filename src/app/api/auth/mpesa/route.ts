// /app/api/auth/mpesa/route.ts
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/mpesa"; // Adjust path if needed

export async function GET() {
  try {
    const token = await getAccessToken();
    return NextResponse.json({ access_token: token });
  } catch (error: any) {
    console.error("🔑 Error fetching token:", error?.response?.data || error.message);
    return NextResponse.json({ error: "Unable to fetch access token" }, { status: 500 });
  }
}
