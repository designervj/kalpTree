import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@/auth";

// Updated schema to accept the full website/page data object and currentWebsite
const bodySchema = z.object({
  website: z.object({
    _id: z.string().optional(),
    slug: z.string().optional(),
    content: z.string().optional(),
    primaryDomain: z.array(z.string()).optional(),
  }).passthrough(), // Allow additional properties
  currentWebsite: z.object({
    _id: z.string().optional(),
    name: z.string().optional(),
    domain: z.string().optional(),
    url: z.string().optional(),
  }).passthrough().optional() // Allow additional properties
});

export async function GET() {
  const session = await auth();
  if (false)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const jar = await cookies();

  // Get both the ID and the full website data
  // const websiteId = jar.get("current_website_id")?.value || null;
  const websiteData = jar.get("current_website_data")?.value || null;
  const currentWebsiteData = jar.get("current_website")?.value || null;

  // Parse the website data if it exists
  const website = websiteData ? JSON.parse(websiteData) : null;
  const currentWebsite = currentWebsiteData ? JSON.parse(currentWebsiteData) : null;

  return NextResponse.json({ website, currentWebsite });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const websiteData = parsed.data.website;
  const currentWebsite = parsed.data.currentWebsite;
  const res = NextResponse.json({ ok: true, website: websiteData, currentWebsite });

  const thirtyDays = 30 * 24 * 60 * 60; // seconds

  // Store the website ID
  // if (websiteData._id) {
  //   res.cookies.set("current_website_id", String(websiteData._id), {
  //     httpOnly: true,
  //     sameSite: "lax",
  //     secure: false,
  //     path: "/",
  //     maxAge: thirtyDays,
  //   });
  // }

  // Store the full website data as JSON
  res.cookies.set("current_website_data", JSON.stringify(websiteData), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: thirtyDays,
  });

  // Store the currentWebsite data if provided
  if (currentWebsite) {
    res.cookies.set("current_website", JSON.stringify(currentWebsite), {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: thirtyDays,
    });
  }

  return res;
}
