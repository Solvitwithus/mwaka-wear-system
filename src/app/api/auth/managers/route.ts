// /api/auth/managers/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const managers = await prisma.user.findMany({
      where: {
        role: {
          name: {
            in: ["Manager", "administrator"],
          },
        },
      },
      select: {
        userName: true,
        firstName: true,
        lastName: true,
      },
    });

    return NextResponse.json(managers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch managers" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
