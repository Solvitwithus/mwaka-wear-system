import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Redirect to homepage ("/") based on the current request URL
  const response = NextResponse.redirect(new URL("/", req.url));

  // Clear the authToken cookie
  response.cookies.set("authToken", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
