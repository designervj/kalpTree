import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, origin } = req.nextUrl;

  // Auth guard for admin and protected APIs (exclude /api/public/* and /api/auth/*)
  const isProtectedApi = /^\/api\/(?!(public|auth)\b)/.test(pathname);
  const isProtected = pathname.startsWith("/admin") || isProtectedApi;

  if (!token) {
    return NextResponse.next();
  }

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

  // if (isPublicContent) {
  //   try {
  //     const hostHeader = req.headers.get("host") || "";
  //     const hostOnly = hostHeader.split(":")[0].toLowerCase();
  //     if (hostOnly) {
  //       const u = new URL("/api/public/websites/resolve-host", origin);
  //       u.searchParams.set("host", hostOnly);
  //       const r = await fetch(u.toString(), {
  //         headers: { host: hostHeader },
  //         cache: "no-store",
  //       });

  //       if (r.ok) {
  //         const data = await r.json();

  //         if (data?.matched && data.websiteId) {
  //           const current = req.cookies.get("current_website_id")?.value;
  //           if (current !== data.websiteId) {
  //             const res = NextResponse.next();
  //             res.cookies.set("current_website_id", String(data._id), {
  //               httpOnly: true,
  //               sameSite: "lax",
  //               path: "/",
  //               maxAge: 60 * 60 * 24 * 30,
  //             });
  //             return res;
  //           }
  //         }
  //       }
  //     }
  //   } catch {
  //     // ignore resolution errors; proceed without setting cookie
  //   }
  // }

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
