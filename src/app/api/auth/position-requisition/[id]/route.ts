// /app/api/auth/position-requisition/[id]/route.ts
import { PrismaClient } from '@/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()

    const updatedRequisition = await prisma.positionRequisition.update({
      where: { id },
      data: {
        status: body.status,
      },
    })

    return NextResponse.json({ success: true, data: updatedRequisition })
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update requisition' }, { status: 500 })
  }
}
