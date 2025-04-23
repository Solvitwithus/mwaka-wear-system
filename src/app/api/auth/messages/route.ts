// import { NextResponse,NextRequest } from "next/server";
// import { PrismaClient } from "@/generated/prisma";

// const prisma = new PrismaClient()

// export async function POST(req:NextRequest){
// const {chat,file} = await req.json()
// console.log("Start");

// try{
//     if(!chat|| !file){
//         return NextResponse.json({"error":"Enter a text"})
//     }
//     else{
//         await prisma.user.create({data:{
//             chat,
//             file
//         }})
//     }
// }
// catch (err) {
//     console.error("Message error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//     console.log("execution completed");
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";


const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
  try {
    const { chat, file } = await req.json();
 console.log("file",file);
 

  

  
    await prisma.message.create({
      data: {
        chat,
        file,
        
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Message error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


