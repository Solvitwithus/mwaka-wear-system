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


export async function GET (){
  try{
const data = await prisma.leaveApplication.findMany()
 
  return NextResponse.json(data, { status: 200 });

  
  }
  catch(err){
  return NextResponse.json( {error:"failed to fetch"},{ status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    console.log("PATCH incoming body:", body);
    const { id, status, approver ,finalApprover} = body;

    const updatedLeave = await prisma.leaveApplication.update({
      where: { id },
      data: {
        status,
        approver,
        finalApprover
       
      },
    });

    return NextResponse.json(updatedLeave, { status: 200 });
  } catch (error) {
    console.error("PATCH Leave Error:", error);
    return NextResponse.json({ error: "Failed to update leave status" }, { status: 500 });
  }
}
