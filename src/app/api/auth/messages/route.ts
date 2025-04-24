


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

    const { chat, file } = await req.json();

    if(!chat && !file){
      return NextResponse.json({"error":"cannot send empty literals 🐱‍🚀"})
    }

    await prisma.message.create({
      data: {
        chat,
        file,
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


export async function GET(){
try{
  const fetchedMessages = await prisma.message.findMany({
    include: {
      user: true, // ✅ Prisma knows to use your User model here
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(fetchedMessages, { status: 200 });

}
catch(err){
  console.error("Message sending error:", err);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
finally{
  await prisma.$disconnect()
}
}