import { auth } from "@/auth";
import { cookies, headers } from "next/headers";
const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:55803";

export default async function PageTemplate({ params }: any) {

  const jar = await cookies();
  const websiteData = jar.get("current_website_data")?.value || null;

  const website = websiteData ? JSON.parse(websiteData) : null;
  console.log("website", website)

  const currentWebsiteData = jar.get("current_website")?.value || null;
  const currentWebsite = currentWebsiteData ? JSON.parse(currentWebsiteData) : null;
  console.log("currentWebsite", currentWebsite)
  // const headersList = await headers();

  // const host = headersList.get("host");


  // const main = await fetch(`${API_BASE_URL}/api/admin/session/${host}`);

  // const domainData = await main.json();

  // const param = await params;

  // const slugs = !param.hasOwnProperty("slug") ? "home" : param.slug;

  // const query = new URLSearchParams({
  //   id: domainData.item, // page ID
  //   slug: slugs, // page slug
  // }).toString();

  // if (!domainData.item) {
  //   return <>404 Not Found</>;
  // }

  const session = await auth();

  console.log("session iiii===", session);

  // const res = await fetch(`${API_BASE_URL}/api/admin/session/website`);

  // const t = await res.json();
  //    console.log(" tttt-->",t)
  // t is an array, get the first item
  const html = website?.content;

  const EditButton = (await import("../EditButton")).default;
  console.log(" html-->", html);
  const name = "Himanshu";

  const processedHtml = html ? html.replace(/\{\{name\}\}/g, name) : "";
  console.log(" processedHtml-->", processedHtml);
  return (
    <div>
      <EditButton
        pageData={website}
        currentWebsite={currentWebsite}
        user={session?.user||{}}
      />
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    </div>
  );
}
