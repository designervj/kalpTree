import { ObjectId } from "mongodb";

export interface PageSEOModel {
    _id?: ObjectId | string;
    websiteId?: ObjectId | string;

    pageName?: string;
    slug?: string;
    path?: string;
    isMainPage?: boolean;

    // SEO Fields
    seo?: {
        title?: string;
        metaDescription?: string;
        focusKeywords?: string[];
        hideFromSearchResults?: boolean;
    };

    searchPreview?: {
        displayTitle?: string;
        displayUrl?: string;
        displayDescription?: string;
    };

    status?: 'draft' | 'published' | 'archived';
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
}