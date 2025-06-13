import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: fetch all bank accounts
export async function GET() {
  try {
    const accounts = await prisma.bankAccount.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bank accounts." }, { status: 500 });
  }
}

// POST: create a new bank account
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newAccount = await prisma.bankAccount.create({
      data: {
        bankName: body.bankName,
        accountCode: body.accountCode,
        accountName: body.accountName,
        accountNumber: body.accountNumber,
        accountType: body.accountType,
        accountStatus: body.accountStatus,
        allowOverdraft: body.allowOverdraft,
        overdraftLimit: parseFloat(body.overdraftLimit || 0),
        isPrimaryAccount: body.isPrimaryAccount,
        usedForPayroll: body.usedForPayroll,
        branchCode: body.branchCode,
        departmentName: body.departmentName,
        currency: body.currency,
        effectiveFrom: new Date(body.effectiveFrom),
        openingBalance: parseFloat(body.openingBalance),
        reconciliationEnabled: body.reconciliationEnabled,
        notes: body.notes,
      },
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create bank account." }, { status: 500 });
  }
}
