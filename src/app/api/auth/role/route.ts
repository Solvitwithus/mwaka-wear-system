
import { PrismaClient } from "@/generated/prisma";
import { NextRequest,NextResponse } from "next/server";

const prisma =new PrismaClient()

export async function POST(req:NextRequest){
   

    
    try{
     
      const { name, description, permissions } = await req.json();

      const existing = await prisma.role.findUnique({ where: { name } });
      if (existing) {
        return NextResponse.json({ error: "Role already exists" }, { status: 400 });
      }
      
      await prisma.role.create({
        data: {
          name,
          description,
          permissions: {
            create: permissions.map((perm: { name: string; value: boolean }) => ({
              name: perm.name,
              value: perm.value
            }))
          }
        }
      });
      


return NextResponse.json(
    { message: 'Role created successfully' },
    { status: 201 }
  );
} 

catch (err) {
  console.error('Error processing request:', err);
  return NextResponse.json(
    { error: 'Server error' },
    { status: 500 }
  );
} 

finally {
  await prisma.$disconnect();
}
}



export async function GET() {
    try {
      // Fetch all roles from the database
      const roles = await prisma.role.findMany();
  
      return NextResponse.json(roles, { status: 200 });
    } catch (err) {
      console.error('Error fetching roles:', err);
      return NextResponse.json(
        { error: 'Server error' },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }