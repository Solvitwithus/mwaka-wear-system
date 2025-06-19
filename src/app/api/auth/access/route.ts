


import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret-key";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const permissions: Record<string, boolean> = {};
    user.role.permissions.forEach((perm) => {
      permissions[perm.name] = perm.value;
    });

    // ✅ RETURN the full user object too
    return NextResponse.json({ user, permissions }, { status: 200 });
  } catch (err) {
    console.error("Access error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  } finally {
    await prisma.$disconnect();
  }
}
