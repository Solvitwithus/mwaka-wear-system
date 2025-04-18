import {PrismaClient} from '@/generated/prisma'
import { NextRequest,NextResponse } from 'next/server'
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'
export async function POST(req:NextRequest){
const {firstName,lastName,userName,shortName,address,email,password,roleId,branch,phone1,phone2,description}=await req.json()
try{
// const existing = await prisma.user.findUnique({
//     where:{
//         userName,
//         email
//     }
// })

// if(existing){
//     return NextResponse.json({error: "User already exist"})
// }

const [existingEmail, existingUsername] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { userName } }),
  ]);
  const encryptedPassword =await bcrypt.hash(password,10)
  if (existingEmail || existingUsername) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  
else{
    await prisma.user.create({
        data:{
            firstName,
            lastName,
            shortName,userName,
            address,
            email,
            password:encryptedPassword,
      roleId,branch,phone1,phone2,description

        }
    })
    return NextResponse.json({message:"Successfully created User!"})
}
}
catch(err){
    console.error("🚨 Error processing request:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
}
finally{
    await prisma.$disconnect()
}
}


export async function GET() {
    console.log("see");
    
    try {
      // Fetch all roles from the database
      const roles = await prisma.user.findMany();
  
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