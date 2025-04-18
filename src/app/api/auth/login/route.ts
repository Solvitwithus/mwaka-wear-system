import {PrismaClient} from "@/generated/prisma"
import { NextResponse,NextRequest } from "next/server"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
const prisma = new PrismaClient()
export async function POST(req:NextRequest){
    const SECRET_KEY = process.env.JWT_SECRET || "secret-Key"
    try{
const {userName,password} = await req.json()


if(!userName|| !password){
    return NextResponse.json({"error":"All fields should have data!"})
}

const user = await prisma.user.findUnique({
    where:{
        userName
    },
    include:{
        role:{
            include:{
                permissions:true
            }
        }
    }
})

if(!user){
    return NextResponse.json({"error":"Invalid Credentials"})
}

const passwordMatch = await bcrypt.compare(password,user.password)
if(!passwordMatch){
    return NextResponse.json({"error":"Invalid Credentials"})
}

else{

    const permissions = user.role.permissions.reduce((acc: Record<string, boolean>, perm) => {
        acc[perm.name] = perm.value;
        return acc;
      }, {});
      

    const token = jwt.sign({
        id:user.id,
name:user.userName,
email:user.email,
role:user.role.name,
permissions
    },SECRET_KEY,{
        expiresIn:"3hrs"
    })

 


    const response = NextResponse.json({"message":"successful Login"})

    response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge:60 * 180,
      });

  
    return response; 
}


}
catch(err){
    console.error('Error fetching roles:', err);
      return NextResponse.json(
        { error: 'Server error' },
        { status: 500 }
      );

}
finally{
    await prisma.$disconnect()
}

}