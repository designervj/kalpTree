import { PageSEOModel } from "@/components/admin/website_seo/PageSEOModel";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ObjectId } from "mongodb";

// // PageSEO interface
// export interface PageSEO {
//     _id?: ObjectId | string;
//     websiteId?: ObjectId | string;

//     pageName?: string;
//     slug?: string;
//     path?: string;
//     isMainPage?: boolean;

//     // SEO Fields
//     seo?: {
//         title?: string;
//         metaDescription?: string;
//         focusKeywords?: string[];
//         hideFromSearchResults?: boolean;
//     };

//     searchPreview?: {
//         displayTitle?: string;
//         displayUrl?: string;
//         displayDescription?: string;
//     };

//     status?: 'draft' | 'published' | 'archived';
//     createdAt?: Date;
//     updatedAt?: Date;
//     createdBy?: ObjectId;
//     updatedBy?: ObjectId;
// }

// // Type definitions for Create and Update inputs
// export interface CreatePageSEOInput {
//     websiteId: string;
//     pageName: string;
//     slug: string;
//     path?: string;
//     isMainPage?: boolean;
//     seo?: {
//         title?: string;
//         metaDescription?: string;
//         focusKeywords?: string[];
//         hideFromSearchResults?: boolean;
//     };
//     searchPreview?: {
//         displayTitle?: string;
//         displayUrl?: string;
//         displayDescription?: string;
//     };
//     status?: 'draft' | 'published' | 'archived';
// }

// export interface UpdatePageSEOInput {
//     pageName?: string;
//     slug?: string;
//     path?: string;
//     isMainPage?: boolean;
//     seo?: {
//         title?: string;
//         metaDescription?: string;
//         focusKeywords?: string[];
//         hideFromSearchResults?: boolean;
//     };
//     searchPreview?: {
//         displayTitle?: string;
//         displayUrl?: string;
//         displayDescription?: string;
//     };
//     status?: 'draft' | 'published' | 'archived';
// }

// Thunk to fetch all page SEO by websiteId
export const fetchPageSEOByWebsite = createAsyncThunk(
    "websiteSEO/fetchByWebsite",
    async (websiteId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `/api/admin/website-seo?websiteId=${websiteId}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch page SEO");
            }

            const data = await response.json();
            return data?.items || [];
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch page SEO");
        }
    }
);

// Thunk to fetch page SEO by ID
export const fetchPageSEOById = createAsyncThunk(
    "websiteSEO/fetchById",
    async (pageSEOId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `/api/admin/website-seo?id=${pageSEOId}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch page SEO");
            }

            const data = await response.json();
            return data.pageSEO as PageSEOModel;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch page SEO");
        }
    }
);

// Thunk to fetch page SEO by slug
export const fetchPageSEOBySlug = createAsyncThunk(
    "websiteSEO/fetchBySlug",
    async (
        { websiteId, slug }: { websiteId: string; slug: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await fetch(
                `/api/admin/website-seo?websiteId=${websiteId}&slug=${slug}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch page SEO");
            }

            const data = await response.json();
            return data.pageSEO as PageSEOModel;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch page SEO");
        }
    }
);

// Thunk to create a new page SEO
export const createPageSEO = createAsyncThunk(
    "websiteSEO/create",
    async (input: PageSEOModel, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/admin/website-seo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create page SEO");
            }

            const data = await response.json();
            return data.pageSEO as PageSEOModel;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to create page SEO");
        }
    }
);

// Thunk to update an existing page SEO
export const updatePageSEO = createAsyncThunk(
    "websiteSEO/update",
    async (
        { pageSEOId, input }: { pageSEOId: string; input: PageSEOModel },
        { rejectWithValue }
    ) => {
        try {
            const response = await fetch(
                `/api/admin/website-seo?id=${pageSEOId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(input),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update page SEO");
            }

            const data = await response.json();
            return data.pageSEO as PageSEOModel;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update page SEO");
        }
    }
);

// Thunk to delete a page SEO
export const deletePageSEO = createAsyncThunk(
    "websiteSEO/delete",
    async (pageSEOId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `/api/admin/website-seo?id=${pageSEOId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete page SEO");
            }

            const data = await response.json();
            return { deletedId: pageSEOId, ...data };
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete page SEO");
        }
    }
);

// Thunk to fetch main page SEO for a website
export const fetchMainPageSEO = createAsyncThunk(
    "websiteSEO/fetchMainPage",
    async (websiteId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `/api/admin/website-seo?websiteId=${websiteId}&isMainPage=true`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch main page SEO");
            }

            const data = await response.json();
            return data.pageSEO as PageSEOModel;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch main page SEO");
        }
    }
);

// Thunk to fetch page SEO by status
export const fetchPageSEOByStatus = createAsyncThunk(
    "websiteSEO/fetchByStatus",
    async (
        { websiteId, status }: { websiteId: string; status: 'draft' | 'published' | 'archived' },
        { rejectWithValue }
    ) => {
        try {
            const response = await fetch(
                `/api/admin/website-seo?websiteId=${websiteId}&status=${status}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch page SEO by status");
            }

            const data = await response.json();
            return data?.items || [];
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch page SEO by status");
        }
    }
);

// Thunk to search page SEO
export const searchPageSEO = createAsyncThunk(
    "websiteSEO/search",
    async (
        { websiteId, query }: { websiteId: string; query: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await fetch(
                `/api/admin/website-seo?websiteId=${websiteId}&search=${encodeURIComponent(query)}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to search page SEO");
            }

            const data = await response.json();
            return data?.items || [];
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to search page SEO");
        }
    }
);

// Thunk to bulk update page SEO status
export const bulkUpdatePageSEOStatus = createAsyncThunk(
    "websiteSEO/bulkUpdateStatus",
    async (
        { pageSEOIds, status }: { pageSEOIds: string[]; status: 'draft' | 'published' | 'archived' },
        { rejectWithValue }
    ) => {
        try {
            const response = await fetch("/api/admin/website-seo/bulk-update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ids: pageSEOIds, status }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to bulk update page SEO status");
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to bulk update page SEO status");
        }
    }
);
