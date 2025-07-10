import { PrismaClient } from '@/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// POST — Create a new candidate
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      candidateCode,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      applicationDate,
      coverLetter,
      designation,
      graduationYear,
      highestEducation,
      institution,
      jobId,
      resumeLink,
      skills,
      status,
      workExperience,
    } = body

    const candidate = await prisma.candidate.create({
      data: {
        candidateCode,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
        applicationDate: new Date(applicationDate),
        coverLetter,
        designation,
        graduationYear: new Date(graduationYear),
        highestEducation,
        institution,
        jobId,
        resumeLink,
        skills,
        status,
        workExperience,
      },
    })

    return NextResponse.json({ success: true, data: candidate }, { status: 201 })
  } catch (error) {
    console.error('POST Candidate Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create candidate' }, { status: 500 })
  }
}

// GET — List all candidates
export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: candidates })
  } catch (error) {
    console.error('GET Candidate Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch candidates' }, { status: 500 })
  }
}
