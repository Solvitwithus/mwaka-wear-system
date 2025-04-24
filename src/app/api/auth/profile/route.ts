


import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret-Key";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - no token" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
    }

    const userId = decoded.id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const {  profileName, profilePicture,  profileAbout } = await req.json();

    if(!profileName&& !profilePicture && !profileAbout){
      return NextResponse.json({"error":"cannot send empty literals 🐱‍🚀"})
    }

    await prisma.profile.create({
      data: {
        profileName, profilePicture,  profileAbout,
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Message sending error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}