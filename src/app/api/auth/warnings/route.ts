import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all warnings
export async function GET() {
  try {
    const warnings = await prisma.warning.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(warnings, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch warnings' }, { status: 500 });
  }
}

// POST: Create a new warning
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employeeId, date, reason, details } = body;

    if (!employeeId || !date || !reason || !details) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newWarning = await prisma.warning.create({
      data: {
        employeeId,
        date: new Date(date),
        reason,
        details,
      },
    });

    return NextResponse.json(newWarning, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create warning' }, { status: 500 });
  }
}
