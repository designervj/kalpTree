import type { ObjectId } from "mongodb";

export interface HeaderDataModel {
    _id: string | ObjectId;
    slug: string;
    tenantId: string | ObjectId;
    websiteId: string | ObjectId
    pageSlug?: string[]
    content: string;
    createdAt: Date;
    updatedAt: Date;
}