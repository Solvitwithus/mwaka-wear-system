// import { NextRequest, NextResponse } from "next/server";
// import jwt, { JwtPayload } from "jsonwebtoken";

// const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// // Define the expected JWT payload structure
// interface CustomJwtPayload extends JwtPayload {
//     permissions: {
//         pos?: boolean;
//         posReport?: boolean;
//     };
// }

// export async function GET(req: NextRequest) {
//     const token = req.cookies.get("authToken")?.value;

//     if (!token) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload; // Cast to CustomJwtPayload
//         return NextResponse.json({ permissions: decoded.permissions });
//     } catch (error) {
//         return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }
// }



import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Updated to reflect new permission structure (array of strings)
interface CustomJwtPayload extends JwtPayload {
  permissions: string[]; // e.g., ['pos', 'posReport']
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;
    return NextResponse.json({ permissions: decoded.permissions });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
