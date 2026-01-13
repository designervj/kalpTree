import { auth } from "@/auth";

import { headers } from "next/headers";

import React from 'react'
import EditButton from "../../(clientpages)/EditButton";
import RootClientPage from "./page.client";
const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:55803";
export default async function HomeTemplate({ params }: any) {
  const tenantId = "6941349ebc8a14e00bbc100c";
  const slug = "home-kalptree";

  try {
    // Fetch page data from API
    const res = await fetch(`${API_BASE_URL}/api/public/pages?slug=${slug}&tenantId=${tenantId}`, {
      cache: 'no-store' // Ensure fresh data on each request
    });

    // Check if response is OK (status 200-299)
    if (!res.ok) {
      console.error(`API returned status ${res.status} for /api/public/pages`);
      // Fallback to static client page
      return <RootClientPage />;
    }

    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('API returned non-JSON response:', contentType);
      // Fallback to static client page
      return <RootClientPage />;
    }

    // Parse JSON response
    const t = await res.json();

    // Check if the response has the expected structure
    if (!t || !t.item || !t.item.content) {
      console.warn('API response missing expected data structure');
      return <RootClientPage />;
    }

   
    

    return (
      <>
        {/* <GethomePage homePageData={t.item} /> */}
      </>
    );

  } catch (error) {
    // Catch any errors (network, JSON parsing, etc.)
    console.error('Error loading homepage data:', error);
    // Fallback to static client page
    return <RootClientPage />;
  }
}