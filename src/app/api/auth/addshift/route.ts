import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all shifts
export async function GET() {
  try {
    const shifts = await prisma.shift.findMany();
    return NextResponse.json(shifts, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch shifts:", error);
    return NextResponse.json({ error: "Failed to fetch shifts" }, { status: 500 });
  }
}

// POST: Create a new shift
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Optional: Basic validation could be added here
    // e.g. if (!data.shiftName) return NextResponse.json({ error: "shiftName is required" }, { status: 400 });

    const newShift = await prisma.shift.create({
      data: {
        shiftName: data.shiftName,
        shiftCode: data.shiftCode,
        startTime: data.startTime,
        endTime: data.endTime,
        shiftActiveDate: new Date(data.shiftActiveDate),
        driver: data.driver,
        vehicle: data.vehicle,
        transportationItem: data.transportationItem,
        startLocation: data.startLocation,
        endLocation: data.endLocation,
        wayPoint: data.wayPoint || null,
        isActive: data.isActive,
        comment: data.comment || null,
        customStartLocation: data.customStartLocation || null,
        customEndLocation: data.customEndLocation || null,
      },
    });

    return NextResponse.json(newShift, { status: 201 });
  } catch (error) {
    console.error("Failed to create shift:", error);
    return NextResponse.json({ error: "Failed to create shift" }, { status: 500 });
  }
}
