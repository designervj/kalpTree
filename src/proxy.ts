import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, origin } = req.nextUrl;

  // Auth guard for admin and protected APIs (exclude /api/public/* and /api/auth/*)
  const isProtectedApi = /^\/api\/(?!(public|auth)\b)/.test(pathname);
  // const isProtected = pathname.startsWith("/admin") || isProtectedApi;
  const isProtected = pathname.startsWith("/admin");

  if (pathname.includes("signup")) {
    const check = await fetch(`${process.env.NEXTAUTH_URL}/api/dev/check`);
    const res = await check.json();
    if (!res.check) {
      const signInUp = new URL("/auth/signup", req.url);
      return NextResponse.redirect(signInUp);
    }
  }

  if (isProtected && !token) {
    const signInUrl = new URL("/auth/signin", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // For public content (non-/api and non-/admin), resolve website by host and set cookie
  const isPublicContent =
    !pathname.startsWith("/api") && !pathname.startsWith("/admin");

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    // Run on all other requests except static assets and Next internals
    "/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|css|js|map|ico)).*)",
  ],
};
