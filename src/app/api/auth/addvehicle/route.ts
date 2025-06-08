import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all vehicles
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

// POST: Create a new vehicle
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      plateNumber,
      make,
      model,
      yearOfManufacture,
      status,
      fuelType,
      capacity,
      driver,
      assignedBranch,
      purpose,
      remarks,
      initialOdometerReading,
      ownershipType,
    } = body;

    const newVehicle = await prisma.vehicle.create({
      data: {
        plateNumber,
        make,
        model,
        yearOfManufacture,
        status,
        fuelType,
        capacity,
        driver,
        assignedBranch,
        purpose,
        remarks,
        initialOdometerReading,
        ownershipType,
      },
    });

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
