// /api/branches/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all branches
export async function GET() {
  try {
    const branches = await prisma.branch.findMany();
    return NextResponse.json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create a new branch
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newBranch = await prisma.branch.create({
      data: {
        branchCode: data.branchCode,
        name: data.name,
        region: data.region,
        town: data.town,
        address: data.address,
        phone: data.phone,
        email: data.email,
        manager: data.manager,
        status: data.status,
        cycleDuration: data.cycleDuration,
        remarks: data.remarks,
        addedBy: data.addedBy,
      },
    });

    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error("Error creating branch:", error);
    return NextResponse.json({ error: "Failed to create branch" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
