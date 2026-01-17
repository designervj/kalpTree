"use server";

import Home from "../(localpages)/homee/page";
import { cookies, headers } from "next/headers";
import { getCollection } from "@/app/api/tenants/[id]/route";
import PageTemplate from "./[lang]/[slug]/page";
import { redirect } from "next/navigation";
import HomeTemplate from "../(localpages)/homee/HomePage";


export default async function MainHomePage({
  params,
}: {
  params?: Promise<{ slug: string; lang: string }>;


}) {
  // Get the host header
  const headersList = await headers();
  const host = headersList.get("host");

  // Check if it's localhost or main KalpTree domain
  const isLocalhost = host?.startsWith("localhost") || host?.startsWith("127.0.0.1");
  const isMainKalpTree = host === "kalptree.xyz" || host === "www.kalptree.xyz";

  // If not localhost or main domain, show the custom domain page (PageTemplate)
  if (!isLocalhost && !isMainKalpTree) {
    return <PageTemplate params={params} />;
  }

  // Otherwise, redirect to the main home page
  return <HomeTemplate />
}
