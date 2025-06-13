// /api/departments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all departments
export async function GET() {
  try {
    const departments = await prisma.department.findMany();
console.log(departments);

    return NextResponse.json(departments, { status: 200 });
  } catch (error) {
    console.error("GET /departments error:", error);
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

// POST: Create a new department
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      departmentName,
      shortName,
      description,
      headOfDepartment,
      isActive,
      establishedDate,
      budgetAmount,
    } = body;

    const newDepartment = await prisma.department.create({
      data: {
        departmentName,
        shortName,
        description,
        headOfDepartmentId: headOfDepartment,
        isActive,
        establishedDate,
        budgetAmount:parseFloat(budgetAmount),
      },
    });

    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    console.error("POST /departments error:", error);
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 });
  }
}
