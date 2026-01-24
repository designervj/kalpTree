
import WebsiteBuilder from '@/components/websiteBuilder/WebsiteBuilder';
import { getDatabase } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import React from 'react';
import { Website } from '@/components/admin/AppShell';
import { WebsitePageModel } from '@/components/admin/website/websitePage/WebsitePageType';

const page = async ({
    params
}: {
    params?: Promise<{ id: string }>;
}) => {
    const param = await params;
    console.log("param", param?.id);
    const db = await getDatabase();
    const websiteColl = await db.collection("websites");
    const website = await websiteColl.findOne({ _id: new ObjectId(param?.id) });
    if (!website) {
        return <div>Website not found</div>
    }


    const pagecoll = await db.collection("pages");
    const pagesData = await pagecoll.find({ websiteId: website._id }).toArray();
    if (pagesData.length == 0) {
        return <div>No pages found</div>
    }

    // Serialize MongoDB documents to plain objects for Client Component
    const serializedWebsite: Website = {
        _id: website._id.toString(),
        tenantId: website.tenantId,
        websiteId: website.websiteId,
        name: website.name,
        primaryDomain: website.primaryDomain,
        systemSubdomain: website.systemSubdomain,
        serviceType: website.serviceType,
        status: website.status,
        lang: website.lang,
    };

    const serializedPages: WebsitePageModel[] = pagesData.map((page) => ({
        _id: page._id.toString(),
        tenantId: page.tenantId,
        websiteId: page.websiteId?.toString(),
        slug: page.slug,
        title: page.title,
        content: page.content,
        seo: page.seo,
        status: page.status,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        publishedAt: page.publishedAt,
    }));

    return (
        <>
            <WebsiteBuilder
                pages={serializedPages}
                website={serializedWebsite} />
        </>
    )
}

export default page