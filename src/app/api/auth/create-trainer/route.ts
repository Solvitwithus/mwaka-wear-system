import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      nationalId,
      fullName,
      email,
      phone1,
      phone2,
      website,
      gender,
      specialization,
      credentials,
      experienceYears,
      languages,
      trainerType,
      availability,
      ratePerSession,
      city,
      country,
      preferredMode,
      canTravel,
      workingZones,
      contractStartDate,
      contractEndDate,
      status,
      trainerProfile,
      remarks,
      portfolioLinks,
      addedBy
    } = data;

    const trainer = await prisma.trainer.create({
      data: {
        nationalId,
        fullName,
        email,
        phone1,
        phone2,
        website,
        gender,
        specialization,
        credentials,
        experienceYears,
        languages,
        trainerType,
        availability,
        ratePerSession,
        city,
        country,
        preferredMode,
        canTravel,
        workingZones,
        contractStartDate,
        contractEndDate,
        status,
        trainerProfile,
        remarks,
        portfolioLinks,
        addedBy
      }
    });

    return NextResponse.json({ message: "Trainer created successfully", data: trainer }, { status: 201 });

  } catch (error) {
    console.error("❌ Failed to create trainer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Optional GET for listing all trainers
export async function GET() {
  try {
    const trainers = await prisma.trainer.findMany();
    return NextResponse.json(trainers, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch trainers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
