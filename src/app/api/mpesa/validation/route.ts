import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
}
