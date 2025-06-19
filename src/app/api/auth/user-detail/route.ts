// /api/auth/managers/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch managers" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
