import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const recent = await prisma.mpesaTransaction.findMany({
    orderBy: { paymentTime: 'desc' },
    take: 10,
  });

  return NextResponse.json(recent);
}
