// /api/auth/managers/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();



export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true, // Include the related role
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error('Error fetching roles:', err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
