// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("🔍 Middleware triggered for:", pathname);

  // Allow the homepage and auth pages without restriction
  if (pathname === "/" || pathname.startsWith("/auth")) {
    console.log("✅ Public route, skipping auth check");
    return NextResponse.next();
  }

  // Check for token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("🔑 Token:", token ? "Exists ✅" : "Missing ❌");

  if (!token) {
    console.log("🚫 No token, redirecting to /auth/signin");
    const url = new URL("/auth/signin", req.url);
    return NextResponse.redirect(url);
  }

  console.log("✅ Authenticated, allowing access");
  return NextResponse.next();
}

// Apply to all routes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // protect everything except assets
  ],
};
