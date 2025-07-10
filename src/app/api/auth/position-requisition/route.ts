import { PrismaClient } from '@/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// POST — create new requisition
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      designation,
      priority,
      department,
      contractType,
      dueDate,
      numberOfPositions,
      jobDescription,
      status,
      reasonForRequisition
    } = body

    const requisition = await prisma.positionRequisition.create({
      data: {
        designation,
        priority,
        department,
        contractType,
        dueDate: new Date(dueDate),
        numberOfPositions: parseInt(numberOfPositions),
        jobDescription,
        status,
        reasonForRequisition
      }
    })

    return NextResponse.json({ success: true, data: requisition }, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create requisition' }, { status: 500 })
  }
}

// GET — list all requisitions
export async function GET() {
  try {
    const requisitions = await prisma.positionRequisition.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: requisitions })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch requisitions' }, { status: 500 })
  }
}
