import { getCollection } from "@/app/api/tenants/[id]/route";
import NotFound from "@/app/not-found";
import { auth } from "@/auth";
import { cookies, headers } from "next/headers";
import { getDatabase } from "@/lib/db/mongodb";
import ProductShowcase from "@/components/admin/product/Cart/Products";
import GetAllProduct from "@/components/admin/product/productList/GetAllProduct";
import GetAllcategory from "@/components/admin/category/listCategory/GetAllcategory";

export default async function SingleProductCategoryPage({
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
          <GetAllcategory websiteId={currentWebsite?._id} />
          {/* <ProductShowcase
            category={slug ? slug[slug.length - 1] : "All Products"}
          /> */}
          {/* <ProductShowcase
            category={slug ? slug[slug.length - 1] : "All Products"}
            layoutConfig={{
              filterPosition: "top",
              gridColumns: { mobile: 2, tablet: 3, desktop: 4 },
            }}
            styleConfig={{
              primaryColor: "#dc2626",
              secondaryColor: "#525252",
              accentColor: "#f97316",
              fontFamily: "Oswald",
              buttonStyle: "pill",
              cardStyle: "flat",
            }}
            heroConfig={{
              backgroundImage: "https://example.com/sports-bg.jpg",
              title: "UNLEASH YOUR POTENTIAL",
              subtitle: "Premium Athletic Gear",
              overlayOpacity: 0.5,
              titleColor: "#ffffff",
              titleSize: "5xl",
              titleTracking: "8px",
            }}
            paginationConfig={{
              enabled: true,
              position: "both",
              style: "compact",
              buttonShape: "circular",
              itemsPerPage: 16,
            }}
            cardConfig={{
              showRating: true,
              showSaleBadge: true,
              imageAspectRatio: "3/4",
              hoverEffect: "scale",
              placeholderIcon: "⚡",
            }}
          /> */}

          <ProductShowcase
            category={slug ? slug[slug.length - 1] : "All Products"}
            layoutConfig={{
              filterPosition: "top",
              gridColumns: { mobile: 1, tablet: 2, desktop: 3 },
              showHeroSection: true,
              heroHeight: "40vh",
            }}
            styleConfig={{
              primaryColor: "#000000",
              secondaryColor: "#666666",
              accentColor: "#2563eb",
              fontFamily: "Montserrat",
              buttonStyle: "square",
              cardStyle: "flat",
            }}
            paginationConfig={{
              enabled: true,
              position: "bottom",
              style: "numbers",
              buttonShape: "square",
              itemsPerPage: 9,
              showPageInfo: true,
            }}
          />
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
