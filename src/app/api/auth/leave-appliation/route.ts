import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const leave = await prisma.leaveApplication.create({
      data: {
        employeeId: body.employeeId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        address: body.address,
        branch: body.branch,
        phone: body.phone,
        leaveType: body.leaveType,
        leaveBalance: body.leaveBalance,
        applicationDate: new Date(body.applicationDate),
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        leaveDays: body.leaveDays,
        remarks: body.remarks,
      },
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    console.error("POST Leave Error:", error);
    return NextResponse.json({ error: "Failed to apply for leave" }, { status: 500 });
  }
}
