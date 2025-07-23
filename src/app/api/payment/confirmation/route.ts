import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { TransID, TransAmount, MSISDN, TransTime } = body;

    await prisma.mpesaTransaction.create({
      data: {
        transactionId: TransID,
        amount: parseFloat(TransAmount),
        phone: MSISDN,
        paymentTime: new Date(), // Optional: parse TransTime here
      },
    });

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' }, { status: 200 });
  } catch (error) {
    console.error('Confirmation Error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Error' }, { status: 500 });
  }
}
