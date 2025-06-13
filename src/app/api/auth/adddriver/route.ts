import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all drivers
export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: 'desc' },
    });
   
    
    return NextResponse.json(drivers, { status: 200 });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return NextResponse.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}

// POST: Create new driver
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // You might want to add validation here

    const createdDriver = await prisma.driver.create({
      data,
    });

    return NextResponse.json(createdDriver, { status: 201 });
  } catch (error) {
    console.error("Error creating driver:", error);
    return NextResponse.json({ error: "Failed to create driver" }, { status: 500 });
  }
}
