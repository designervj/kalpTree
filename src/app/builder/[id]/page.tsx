import WebsiteBuilder from "@/components/websiteBuilder/WebsiteBuilder";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import React from "react";
import { Website } from "@/components/admin/AppShell";
import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";
import { serializeMongoDoc } from "@/app/api/appshell-data/route";

const page = async ({
  params,
  searchParams,
}: {
  params?: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string; slug?: string }>;
}) => {
  const param = await params;
  const searchParamsData = await searchParams;
  // Normalize searchParams: if 'page' exists, use it as 'slug'
  const search = searchParamsData?.page
    ? { slug: searchParamsData.page }
    : searchParamsData?.slug
      ? { slug: searchParamsData.slug }
      : undefined;

  if (!param?.id || !ObjectId.isValid(param.id)) {
    return <div>Invalid Website ID</div>;
  }

  const db = await getDatabase();
  const tenantColl = await db.collection("tenants");
  const tenant = await tenantColl.findOne({ _id: new ObjectId(param?.id) });
  if (!tenant) {
    return <div>Website not found</div>;
  }

  const pagecoll = await db.collection("pages");
  const pagesData = await pagecoll.find({ tenantId: tenant._id }).toArray();
  if (pagesData.length == 0) {
    return <div>No pages found</div>;
  }



  // get header
  const allheader_coll = await db.collection("templates_header");
  const headerData = await allheader_coll.findOne({
    tenantId: tenant.tenantId,
  });


  const docs = serializeMongoDoc(tenant);

  const serializedPages: WebsitePageModel[] = pagesData.map((page) => ({
    _id: page._id.toString(),
    tenantId: page.tenantId?.toString() ?? "",
    websiteId: page.websiteId?.toString(),
    slug: page.slug,
    title: page.title,
    content: page.content,
    seo: page.seo,
    status: page.status,
    isHomePage: page.isHomePage,
    createdAt: page.createdAt ? new Date(page.createdAt).toISOString() : "",
    updatedAt: page.updatedAt ? new Date(page.updatedAt).toISOString() : "",
    publishedAt: page.publishedAt
      ? new Date(page.publishedAt).toISOString()
      : "",
    dictionary: page.dictionary ? page.dictionary : {},
  }));

  return (
    <>
      <WebsiteBuilder
        pages={serializedPages}
        website={docs}
        search={search}
        headerData={JSON.parse(JSON.stringify(headerData))}
        // footerData={JSON.parse(JSON.stringify(footerData))}
      />
    </>
  );
};

export default page;
