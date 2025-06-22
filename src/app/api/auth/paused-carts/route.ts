import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// POST: Save paused cart
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    

    const { name, branchName, userId } = body;

    if (!name || !branchName || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract items from object keys that are numbers
    const items = Object.keys(body)
      .filter((key) => !isNaN(Number(key))) // Only numeric keys
      .map((key) => body[key]);

    if (items.length === 0) {
      return NextResponse.json(
        { error: "No items found in payload" },
        { status: 400 }
      );
    }

    const pausedCart = await prisma.pausedCart.create({
      data: {
        name,
        branchName,
        userId,
        items: {
          create: items.map((item: any) => ({
            itemCode: item.itemCode,
            itemName: item.itemName,
            price: item.price,
            qty: item.qty,
            availableQty: item.availableQty,
          })),
        },
      },
    });

    return NextResponse.json(pausedCart, { status: 201 });
  } catch (error) {
    console.error("Error saving paused cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// GET: Fetch all paused carts
export async function GET() {
  try {
    const pausedCarts = await prisma.pausedCart.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(pausedCarts);
  } catch (error) {
    console.error("Error fetching paused carts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { pausedCartId } = body;

    if (!pausedCartId) {
      return NextResponse.json({ error: "Paused cart ID is required" }, { status: 400 });
    }

    // First, delete all items linked to the paused cart
    await prisma.pausedCartItem.deleteMany({
      where: {
        pausedCartId: pausedCartId,
      },
    });

    // Then delete the paused cart
    await prisma.pausedCart.delete({
      where: {
        id: pausedCartId,
      },
    });

    return NextResponse.json({ message: "Paused cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting paused cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}