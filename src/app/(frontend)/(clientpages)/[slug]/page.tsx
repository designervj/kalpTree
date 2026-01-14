import { getCollection } from "@/app/api/tenants/[id]/route";
import { auth } from "@/auth";
import { cookies, headers } from "next/headers";
const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:55803";

export default async function PageTemplate({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const param = await params;
  const header = await headers();
  const host = header.get("host");

  const jar = await cookies();
  let websiteData = jar.get("current_website_data")?.value || null;

  let website = websiteData ? JSON.parse(websiteData) : null;

  const currentWebsiteData = jar.get("current_website")?.value || null;
  const currentWebsite = currentWebsiteData
    ? JSON.parse(currentWebsiteData)
    : null;
  console.log("currentWebsite", currentWebsite);

  const session = await auth();

  console.log("session iiii===", session);

  if (!website) {
    const websiteColl = await getCollection("websites");
    const pagecoll = await getCollection("pages");

    let websitedata = await websiteColl.findOne({
      primaryDomain: {
        $in: [host],
      },
    });
    let page = await pagecoll.findOne({
      websiteId: websitedata._id,
      slug: param.slug,
    });
    website = page;
  }

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
        user={session?.user || {}}
      />
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    </div>
  );
}
