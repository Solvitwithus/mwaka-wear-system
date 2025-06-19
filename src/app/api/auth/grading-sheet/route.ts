import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Create a new GradingSheet with itemsProduced
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      baleName,
      baleWeight,
      branch,
      comment,
      damageCount,
      damageWeight,
      gradeDate,
      gradeReference,
      grader,
      itemCount,
      itemtoGrade,
      unpairedCount,
      workCenter,
      itemsProduced,
    } = body;

    const gradingSheet = await prisma.gradingSheet.create({
      data: {
        baleName,
        baleWeight: parseFloat(baleWeight),
        branch,
        comment,
        damageCount: parseInt(damageCount),
        damageWeight: parseFloat(damageWeight),
        gradeDate: new Date(gradeDate),
        gradeReference,
        grader,
        itemCount: parseInt(itemCount),
        itemtoGrade,
        unpairedCount: parseInt(unpairedCount),
        workCenter,
        itemsProduced: {
          create: itemsProduced.map((item: any) => ({
            itemCode: item.itemCode,
            itemName: item.itemName,
            grade: item.grade,
            quantity: parseInt(item.quantity),
            qtyToHold: item.qtyToHold ? parseInt(item.qtyToHold) : 0,
            sellingPrice: parseFloat(item.sellingPrice),
           qtyToDispatch: item.qtyToDispatch ? parseFloat(item.qtyToDispatch) : 0
          })),
        },
      },
    });

    return NextResponse.json(gradingSheet, { status: 201 });
  } catch (error) {
    console.error("GradingSheet POST error:", error);
    return NextResponse.json({ error: "Failed to create grading sheet" }, { status: 500 });
  }
}

// GET: Retrieve all grading sheets with related items
export async function GET() {
  try {
    const gradingSheets = await prisma.gradingSheet.findMany({
      include: {
        itemsProduced: true,
      },
    });

    return NextResponse.json(gradingSheets);
  } catch (error) {
    console.error("GradingSheet GET error:", error);
    return NextResponse.json({ error: "Failed to fetch grading sheets" }, { status: 500 });
  }
}
// PATCH: Update status and/or comment of an existing GradingSheet
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, comment } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required." }, { status: 400 });
    }

    const updatedGradingSheet = await prisma.gradingSheet.update({
      where: { id },
      data: {
        status,
        ...(comment && { comment }), // only update comment if provided
      },
    });

    return NextResponse.json(updatedGradingSheet, { status: 200 });
  } catch (error) {
    console.error("GradingSheet PATCH error:", error);
    return NextResponse.json({ error: "Failed to update grading sheet" }, { status: 500 });
  }
}
