import {PrismaClient} from '@/generated/prisma'
import bcrypt from 'bcryptjs';
import { NextRequest,NextResponse } from 'next/server'
const prisma = new PrismaClient()

// DELETE: Delete a user
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const {
    firstName, lastName, shortName, userName,
    address, email, password, roleId,
    branch, phone1, phone2, description
  } = await req.json();

  try {
    const updateData: any = {
      firstName, lastName, shortName, userName,
      address, email, roleId, branch,
      phone1, phone2, description
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}