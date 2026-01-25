import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getCollection } from "./app/api/tenants/[id]/route";

export async function proxy(req: NextRequest) {
  const host = req.headers.get("host");

  // Redirect www → non-www
  // if (host === "www.kalptree.xyz") {
  //   return NextResponse.redirect("https://kalptree.xyz" + req.nextUrl.pathname);
  // }

  const publicApiRoutes = ["/api/admin/product", "/api/admin/category"];

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV == "production" ? true : false,
  });

  const { pathname } = req.nextUrl;

  const isPublicApi = publicApiRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isProtected =
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/api") && !isPublicApi);

  if (pathname.includes("signup")) {
    const check = await fetch(`${process.env.NEXTAUTH_URL}/api/dev/check`);
    const res = await check.json();
    if (!res.check) {
      return NextResponse.redirect(new URL("/auth/signup", req.url));
    }
  }

  console.log(isProtected && !token, isProtected, token, pathname, isPublicApi);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

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
