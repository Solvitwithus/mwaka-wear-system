// /app/api/auth/add-candidate/[id]/route.ts
import { PrismaClient } from '@/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { status } = await req.json()

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: { status ,tools:status.tools},
    })

    return NextResponse.json({ success: true, data: updatedCandidate })
  } catch (error) {
    console.error('PATCH Candidate Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update candidate status' }, { status: 500 })
  }
}
