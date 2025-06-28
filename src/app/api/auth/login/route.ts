

import { PrismaClient } from "@/generated/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import LZString from "lz-string";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret-Key";

export async function POST(req: NextRequest) {
  try {
    const { userName, password } = await req.json();

    if (!userName || !password) {
      return NextResponse.json({ error: "All fields should have data!" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { userName },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    // Reduce permissions to key-value pairs and compress
    // const permissions = user.role.permissions.reduce((acc: Record<string, boolean>, perm) => {
    //   acc[perm.name] = perm.value;
    //   return acc;
    // }, {});

    
    const token = jwt.sign(
      {
        id: user.id,
        name: user.userName,
        email: user.email,
        role: user.role.name,
        
      },
      SECRET_KEY,
      { expiresIn: "3h" }
    );
    console.log("Token length:", token.length);
    // Use new NextResponse and set cookie before returning
    const response = new NextResponse(JSON.stringify({ message: "Successful Login" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: true, // ✅ false for local, true in production
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 3, // 3 hours in seconds
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
    console.log("Login execution completed");
  }
}
