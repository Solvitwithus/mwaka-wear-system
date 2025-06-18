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
