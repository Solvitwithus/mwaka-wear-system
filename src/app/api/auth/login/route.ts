// import {PrismaClient} from "@/generated/prisma"
// import { NextResponse,NextRequest } from "next/server"
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs"
// import LZString from "lz-string";
// const prisma = new PrismaClient()
// export async function POST(req:NextRequest){
//     const SECRET_KEY = process.env.JWT_SECRET || "secret-Key"
//     try{
// const {userName,password} = await req.json()


// if(!userName|| !password){
//     return NextResponse.json({"error":"All fields should have data!"})
// }

// const user = await prisma.user.findUnique({
//     where:{
//         userName
//     },
//     include:{
//         role:{
//             include:{
//                 permissions:true
//             }
//         }
//     }
// })

// if(!user){
//     return NextResponse.json({"error":"Invalid Credentials"})
// }

// const passwordMatch = await bcrypt.compare(password,user.password)
// if(!passwordMatch){
//     return NextResponse.json({"error":"Invalid Credentials"})
// }

// else{

//     const permissions = user.role.permissions.reduce((acc: Record<string, boolean>, perm) => {
//         acc[perm.name] = perm.value;
//         return acc;
//       }, {});
      
//       const compressedPermissions = LZString.compressToBase64(JSON.stringify(permissions));
//     const token = jwt.sign({
//         id:user.id,
// name:user.userName,
// email:user.email,
// role:user.role.name,
// permissions: compressedPermissions,
//     },SECRET_KEY,{
//         expiresIn:"3hrs"
//     })

 


//     const response = NextResponse.json({"message":"successful Login"})

//     response.cookies.set("authToken", token, {
//         httpOnly: true,
//         // secure: process.env.NODE_ENV === "production",
//         secure:false,
//         sameSite: "strict",
//         path: "/",
//         maxAge:60 * 180,
//       });

  
//     return response; 
   
// }



// }
// catch(err){
//     console.error('Error fetching roles:', err);
//       return NextResponse.json(
//         { error: 'Server error' },
//         { status: 500 }
//       );

// }
// finally{
    
//     await prisma.$disconnect()
//     console.log("Loginexecutioncompleted");
// }

// }

// import { PrismaClient } from "@/generated/prisma";
// import { NextResponse, NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   const SECRET_KEY = process.env.JWT_SECRET || "secret-Key";

//   const contentLength = req.headers.get("content-length");
//   const MAX_SIZE = 10 * 1024 * 1024; // 2MB

//   if (contentLength && parseInt(contentLength) > MAX_SIZE) {
//     return NextResponse.json({ error: "Payload too large" }, { status: 413 });
//   }

//   try {
//     const { userName, password } = await req.json();

//     if (!userName || !password) {
//       return NextResponse.json({ error: "All fields should have data!" });
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         userName,
//       },
//       include: {
//         role: {
//           include: {
//             permissions: true,
//           },
//         },
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "Invalid Credentials" });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return NextResponse.json({ error: "Invalid Credentials" });
//     }

//     const permissions = user.role.permissions.reduce(
//       (acc: Record<string, boolean>, perm) => {
//         acc[perm.name] = perm.value;
//         return acc;
//       },
//       {}
//     );

//     const token = jwt.sign(
//       {
//         id: user.id,
//         name: user.userName,
//         email: user.email,
//         role: user.role.name,
//         permissions:undefined
//       },
//       SECRET_KEY,
//       {
//         expiresIn: "3hrs",
//       }
//     );

//     const response = NextResponse.json({ message: "Successful Login" });

//     response.cookies.set("authToken", token, {
//       httpOnly: true,
//       secure: false, // Set to true in production
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 180,
//     });

//     return response;
//   } catch (err) {
//     console.error("Error fetching roles:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//     console.log("Login execution completed");
//   }
// }


import { PrismaClient } from "@/generated/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import LZString from "lz-string";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret-Key";

export async function POST(req: NextRequest) {
  try {
    const { userName, password } = await req.json();

    if (!userName || !password) {
      return NextResponse.json({ error: "All fields should have data!" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { userName },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    // Reduce permissions to key-value pairs and compress
    // const permissions = user.role.permissions.reduce((acc: Record<string, boolean>, perm) => {
    //   acc[perm.name] = perm.value;
    //   return acc;
    // }, {});

    
    const token = jwt.sign(
      {
        id: user.id,
        name: user.userName,
        email: user.email,
        role: user.role.name,
        
      },
      SECRET_KEY,
      { expiresIn: "3h" }
    );
    console.log("Token length:", token.length);
    // Use new NextResponse and set cookie before returning
    const response = new NextResponse(JSON.stringify({ message: "Successful Login" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: false, // ✅ false for local, true in production
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 3, // 3 hours in seconds
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
    console.log("Login execution completed");
  }
}
