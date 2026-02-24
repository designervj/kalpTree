import { getCollection } from "@/app/api/tenants/[id]/route";
import NotFound from "@/app/not-found";
import { auth } from "@/auth";
import { cookies, headers } from "next/headers";
import { getDatabase } from "@/lib/db/mongodb";
import SlugPageHome from "./SlugPageHome";
import ModernCartPage from "@/components/admin/product/Cart/Cart";
import ModernCheckout from "@/components/admin/product/Cart/CheckoutPage";
import ProductShowcase from "@/components/admin/product/Cart/Products";
import GetAllProduct from "@/components/admin/product/productList/GetAllProduct";
import ProductCategoryPage from "../product-category/page";
import SingleProductPage from "../product/[slug]/page";
import ComingSoonPage from "./comingsoon/page";

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
  //  console.log("host", host);
  const EditButton = (await import("../../EditButtonBackup")).default;

  // Check if it's localhost (any port) or the MAIN KalpTree domain (not subdomains)
  const isLocalhost =
    host?.startsWith("localhost") || host?.startsWith("127.0.0.1");
  const isMainKalpTree = host === "kalptree.xyz" || host === "www.kalptree.xyz";

  const jar = await cookies();
  let websiteData = jar.get("current_website_data")?.value || null;

  let website = websiteData ? JSON.parse(websiteData) : null;
  const currentWebsiteData = jar.get("current_website")?.value || null;
  let currentWebsite = currentWebsiteData
    ? JSON.parse(currentWebsiteData)
    : null;

  const session = await auth();

  // if(!session){
  //   redirect("/auth/signin");
  // }

  let slug = param?.slug ? param.slug : null;
  let lang = param?.lang ? param.lang : null;

  if (lang && lang.length > 2 && !slug) {
    slug = lang;
    lang = null;
  }
  // Get header/footer collection (needed regardless of website source)
  try {
    const allheader_coll = await db.collection("templates_header");
    const allfooter_coll = await db.collection("templates_footer");

    if (!website) {
      const tenantColl = await getCollection("tenants");
      const pagecoll = await getCollection("pages");

      let tenantData = await tenantColl.findOne({
        "website.primaryDomain": {
          $in: [host],
        },
      });

      if (!tenantData) {
        return <NotFound />;
      }

      let page;
      if (!slug) {
        page = await pagecoll.findOne({
          tenantId: tenantData._id,
          isHomePage: true,
        });
      } else {
        page = await pagecoll.findOne({
          tenantId: tenantData._id,
          slug: slug,
        });
      }

      if (!lang && tenantData.website.lang) {
        lang = tenantData.website.lang.find(
          (d: any) => d.default == true,
        )?.name;
      }
      website = page;
      currentWebsite = {
        ...tenantData,
        _id: tenantData._id.toString(),
        tenantId: tenantData.tenantId ? tenantData.tenantId.toString() : null,
      };
    }

    if (
      (lang && lang.length > 2 && lang === "product-category") ||
      (lang && lang.length == 2 && slug == "product-category")
    ) {
      return <ProductCategoryPage params={params} />;
    } else if (
      (lang && lang.length > 2 && lang === "product") ||
      (lang && lang.length == 2 && slug == "product")
    ) {
      return <SingleProductPage params={params} />;
    }

    const obj: any = {
      cart: <ModernCartPage />,
      checkout: (
        <>
          <GetAllProduct websiteId={currentWebsite?._id} />
          <ModernCheckout />
        </>
      ),
      product: (
        <>
          <GetAllProduct websiteId={currentWebsite?._id} />
          <ProductShowcase />
        </>
      ),
    };

    if (slug && slug in obj) {
      return obj[slug];
    }

    if (!website) {
      return <NotFound />;
    }

    const html =
      website?.content2 && lang ? website.content2[lang] : website.content;

    if (!html) {
      return <ComingSoonPage />;
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

    // if (!lang && websitedata.lang) {
    //   lang = websitedata.lang.find((d: any) => d.default == true)?.name;
    // }
    // website = page;
    // currentWebsite = {
    //   ...websitedata,
    //   _id: websitedata._id.toString(),
    //   tenantId: websitedata.tenantId ? websitedata.tenantId.toString() : null,
    // };
    // }

    const footerData = await allfooter_coll.findOne({
      websiteId: currentWebsite._id,
    });

    // Serialize MongoDB documents to plain objects
    const serializedHeaderData = headerData
      ? JSON.parse(JSON.stringify(headerData))
      : {};
    const serializedFooterData = footerData
      ? JSON.parse(JSON.stringify(footerData))
      : {};

    const processedHtml = html;

    return (
      <>
        <SlugPageHome
          website={website}
          currentWebsite={currentWebsite}
          user={session?.user || {}}
          html={processedHtml}
          headerData={serializedHeaderData}
          footerData={serializedFooterData}
        />
      </>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    return <NotFound />;
  }
}
