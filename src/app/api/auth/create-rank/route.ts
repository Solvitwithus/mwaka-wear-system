import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all ranks
export async function GET() {
  try {
    const ranks = await prisma.rank.findMany();
    return NextResponse.json(ranks, { status: 200 });
  } catch (error) {
    console.error("Error fetching ranks:", error);
    return NextResponse.json({ message: "Failed to fetch ranks" }, { status: 500 });
  }
}

// POST: Create new rank
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      rankName,
      shortName,
      description,
      rankLevel,
      isActive,
      createdDate,
    } = body;

    const newRank = await prisma.rank.create({
      data: {
        rankName,
        shortName,
        description,
        rankLevel,
        isActive,
        createdDate: new Date(createdDate),
      },
    });

    return NextResponse.json(newRank, { status: 201 });
  } catch (error) {
    console.error("Error creating rank:", error);
    return NextResponse.json({ message: "Failed to create rank" }, { status: 500 });
  }
}
