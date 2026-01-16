"use server";

import { redirect } from "next/navigation";
// import Home from "../(localpages)/homee/page";
import { cookies, headers } from "next/headers";
import { getCollection } from "@/app/api/tenants/[id]/route";
import PageTemplate from "./[lang]/[slug]/page";

export default async function MainHomePage({
  params,
}: {
  params?: Promise<{ slug: string; lang: string }>;
}) {
  return <PageTemplate params={params} />;
}
