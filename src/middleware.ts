


// import { NextResponse, type NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const publicRoutes = ["/", "/api/auth/login"];

// const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret-Key");

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const isStaticAsset = pathname.match(/\.(?:png|jpg|jpeg|svg|gif|ico|webp|woff2?|ttf|eot|txt|json|js|css)$/i);
//   const isInternal = pathname.startsWith("/_next") || pathname === "/favicon.ico";

//   if (publicRoutes.includes(pathname) || isStaticAsset || isInternal) {
//     return NextResponse.next();
//   }

//   const token = req.cookies.get("authToken")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   try {
//     await jwtVerify(token, secret); // ✅ jose doesn't require crypto module
//     return NextResponse.next();
//   } catch (err) {
//     console.error("❌ Invalid token:", err);
//     return NextResponse.redirect(new URL("/", req.url));
//   }
// }









// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };



import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/", "/api/auth/login"];

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret-Key");

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isStaticAsset = pathname.match(/\.(?:png|jpg|jpeg|svg|gif|ico|webp|woff2?|ttf|eot|txt|json|js|css)$/i);
  const isInternal = pathname.startsWith("/_next") || pathname === "/favicon.ico";

  if (publicRoutes.includes(pathname) || isStaticAsset || isInternal) {
    return NextResponse.next();
  }

  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // 🧠 Restrict access to /pos for non-cashiers
    if (pathname.startsWith("/sales/pos")) {
      const userRole = payload.role as string; // Make sure your JWT includes a 'role' claim
      if (!["cashier", "sales"].includes(userRole)) {
        return NextResponse.redirect(new URL("/sales?error=unauthorized", req.url));

      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("❌ Invalid token:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
