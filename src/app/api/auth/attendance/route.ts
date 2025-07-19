import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Save multiple attendance records
export async function POST(req: NextRequest) {
  try {
    const attendanceData = await req.json();

    // Create or update each record
    const operations = attendanceData.map(async (entry: any) => {
      return prisma.attendance.upsert({
        where: {
          employeeId_date: {
            employeeId: entry.employeeId,
            date: new Date(entry.date),
          },
        },
        update: {
          status: entry.status,
        },
        create: {
          employeeId: entry.employeeId,
          date: new Date(entry.date),
          status: entry.status,
        },
      });
    });

    await Promise.all(operations);

    return NextResponse.json({ message: "Attendance saved successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return NextResponse.json({ error: "Failed to save attendance." }, { status: 500 });
  }
}

// GET: Fetch attendance records
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  try {
    const records = await prisma.attendance.findMany({
      where: date
        ? {
            date: new Date(date),
          }
        : undefined,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ error: "Failed to fetch attendance." }, { status: 500 });
  }
}
