import { getCollection } from "@/app/api/tenants/[id]/route";
import NotFound from "@/app/not-found";
import { auth } from "@/auth";
import { cookies, headers } from "next/headers";
import { getDatabase } from "@/lib/db/mongodb";
import ProductShowcase from "@/components/admin/product/Cart/Products";
import GetAllProduct from "@/components/admin/product/productList/GetAllProduct";

export default async function ProductCategoryPage({
  params,
}: {
  params?: Promise<{ lang: string; slug: string }>;
}) {
  const param = await params;
  const header = await headers();
  const host = header.get("host");
  const db = await getDatabase();

  const jar = await cookies();
  const currentWebsiteData = jar.get("current_website")?.value || null;
  let currentWebsite = currentWebsiteData
    ? JSON.parse(currentWebsiteData)
    : null;

  const session = await auth();
  const lang = param?.lang || null;
  const slug = param?.slug || null;

  try {
    const allheader_coll = await db.collection("templates_header");
    const allfooter_coll = await db.collection("templates_footer");

    // If no website data in cookies, fetch from database
    if (!currentWebsite) {
      const websiteColl = await getCollection("websites");

      let websitedata = await websiteColl.findOne({
        primaryDomain: {
          $in: [host],
        },
      });

      if (!websitedata) {
        return <NotFound />;
      }

      currentWebsite = {
        ...websitedata,
        _id: websitedata._id.toString(),
        tenantId: websitedata.tenantId ? websitedata.tenantId.toString() : null,
      };
    }

    // Get header and footer data
    const headerData = await allheader_coll.findOne({
      websiteId: currentWebsite._id,
    });

    const footerData = await allfooter_coll.findOne({
      websiteId: currentWebsite._id,
    });

    // Serialize MongoDB documents to plain objects
    const serializedHeaderData = headerData
      ? JSON.parse(JSON.stringify(headerData))
      : null;
    const serializedFooterData = footerData
      ? JSON.parse(JSON.stringify(footerData))
      : null;

    // Get language-specific content if available
    const headerContent =
      lang && serializedHeaderData?.content2?.[lang]
        ? serializedHeaderData.content2[lang]
        : serializedHeaderData?.content;

    const footerContent =
      lang && serializedFooterData?.content2?.[lang]
        ? serializedFooterData.content2[lang]
        : serializedFooterData?.content;

    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        {headerContent && (
          <header dangerouslySetInnerHTML={{ __html: headerContent }} />
        )}

        {/* Main Content - Product Page */}
        <main className="flex-grow">
          <GetAllProduct websiteId={currentWebsite?._id} />
          <ProductShowcase category={slug ? slug[0] : "All Products"} />
        </main>

        {/* Footer */}
        {footerContent && (
          <footer dangerouslySetInnerHTML={{ __html: footerContent }} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading product page:", error);
    return <NotFound />;
  }
}
