import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create a new contract type
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      contractCode,
      contractName,
      category,
      duration,
      description,
      status,
      addedBy,
      remarks
    } = data;

    const contractType = await prisma.contractType.create({
      data: {
        contractCode,
        contractName,
        category,
        duration,
        description,
        status,
        addedBy,
        remarks
      }
    });

    return NextResponse.json({ message: "Contract type created successfully", data: contractType }, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create contract type:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Retrieve all contract types
export async function GET() {
  try {
    const contractTypes = await prisma.contractType.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(contractTypes, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch contract types:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
