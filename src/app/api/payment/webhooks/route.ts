import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// Helper function to parse M-PESA TransTime like "20250723120900"
const parseMpesaDate = (mpesaTime: string): Date => {
  return new Date(
    mpesaTime.slice(0, 4) + '-' +
    mpesaTime.slice(4, 6) + '-' +
    mpesaTime.slice(6, 8) + 'T' +
    mpesaTime.slice(8, 10) + ':' +
    mpesaTime.slice(10, 12) + ':' +
    mpesaTime.slice(12, 14)
  );
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      TransID,
      TransAmount,
      MSISDN,
      TransTime,
      BillRefNumber,
    }: {
      TransID: string;
      TransAmount: string;
      MSISDN: string;
      TransTime: string;
      BillRefNumber?: string;
    } = body;

    const paymentTime = parseMpesaDate(TransTime);

    await prisma.mpesaTransaction.create({
      data: {
        transactionId: TransID,
        amount: parseFloat(TransAmount),
        phone: MSISDN,
        paymentTime,
        billRef: BillRefNumber || '',
      },
    });

    return NextResponse.json({ message: 'Payment recorded' }, { status: 200 });
  } catch (error) {
    console.error('M-PESA Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
