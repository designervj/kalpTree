import { getCollection } from "@/app/api/tenants/[id]/route";
import NotFound from "@/app/not-found";
import { auth } from "@/auth";
import { cookies, headers } from "next/headers";
const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:55803";

export default async function PageTemplate({
  params,
}: {
  params?: Promise<{ slug: string; lang: string }>;
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

  const session = await auth();
  let slug = param?.slug ? param.slug : "home";
  let lang = param?.lang ? param.lang : null;
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
      slug: slug,
    });

    if (!lang) {
      lang = websitedata.lang.find((d: any) => d.default == true)?.name;
    }
    website = page;
  }

  const html = website?.content2 ? website.content2[lang!] : website.content;

  if (!html) {
    return <NotFound />;
  }

  const EditButton = (await import("../../EditButton")).default;

  const name = "Himanshu";

  const processedHtml = html ? html.replace(/\{\{name\}\}/g, name) : "";

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
