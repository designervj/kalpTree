import { getCollection } from "@/app/api/tenants/[id]/route";
import NotFound from "@/app/not-found";
import { auth } from "@/auth";
import { cookies, headers } from "next/headers";
import RenderHtml from "./RenderHtml";
import { demoProduct, processedHTML } from "../../../../../../utils/utlis";
import { getDatabase } from "@/lib/db/mongodb";
const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:55803";

export default async function PageTemplate({
  params,
}: {
  params?: Promise<{ slug: string; lang: string }>;
}) {
  const param = await params;
  const header = await headers();
  const host = header.get("host");
  const db = await getDatabase();

  const EditButton = (await import("../../EditButton")).default;
  console.log("host--", host)

  // Check if it's localhost (any port) or the MAIN KalpTree domain (not subdomains)
  const isLocalhost = host?.startsWith("localhost") || host?.startsWith("127.0.0.1");
  const isMainKalpTree = host === "kalptree.xyz" || host === "www.kalptree.xyz";

  if (isLocalhost || isMainKalpTree) {
    const session = await auth();
    const getHomePage = await db.collection("pages").findOne({
      slug: "home-kalptree"
    })
    if (!getHomePage) {
      return <NotFound />
    }
    const html = getHomePage.content

    return <div>
      {session && session.user && session.user.role == "superadmin" &&
        <EditButton
          pageData={getHomePage}
          currentWebsite={null}
          user={session?.user || null}
          type="page"
        />}
      <RenderHtml html={html}
        currentWebsite={null}
        headerData={null}
        footerData={null}
      />
    </div>

  } else {
    const jar = await cookies();
    let websiteData = jar.get("current_website_data")?.value || null;
    let website = websiteData ? JSON.parse(websiteData) : null;
    const currentWebsiteData = jar.get("current_website")?.value || null;
    let currentWebsite = currentWebsiteData
      ? JSON.parse(currentWebsiteData)
      : null;

    const session = await auth();
    let slug = param?.slug ? param.slug : null;
    let lang = param?.lang ? param.lang : null;

    if (lang && lang.length > 2 && !slug) {
      slug = lang;
      lang = null;
    } else if (!slug) {
      slug = "home";
    }

    // Get header/footer collection (needed regardless of website source)
    try {
      const allheader_coll = await db.collection("templates_header");
      const allfooter_coll = await db.collection("templates_footer");

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
        if (!lang && websitedata.lang) {
          lang = websitedata.lang.find((d: any) => d.default == true)?.name;
        }
        website = page;
        currentWebsite = {
          ...websitedata,
          _id: websitedata._id.toString(),
          tenantId: websitedata.tenantId ? websitedata.tenantId.toString() : null,
        };
      }

      if (!website) {
        return <NotFound />;
      }

      const html = website?.content2 ? website.content2[lang!] : website.content;

      if (!html) {
        return <NotFound />;
      }

      website = {
        ...website,
        _id: String(website._id),
        tenantId: String(website.tenantId),
        websiteId: String(website.websiteId),
      };


      const headerData = await allheader_coll.findOne({
        websiteId: currentWebsite._id,
      });

      const footerData = await allfooter_coll.findOne({
        websiteId: currentWebsite._id,
      });

      const processedHtml = html;
      return (
        <div>
          {session && session.user && <EditButton
            pageData={website}
            currentWebsite={currentWebsite}
            user={session?.user || {}}
            type="page"
          />}
          <RenderHtml html={processedHtml}
            currentWebsite={currentWebsite}
            headerData={headerData || {}}
            footerData={footerData || {}}
          />
        </div>
      );
    } catch (error) {
      console.error("Error loading page:", error);
      return <NotFound />;
    }
  }

}

