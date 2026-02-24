
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FooterState } from "./FooterSlice";
import type { ObjectId } from "mongodb";
import { TemplateDocument } from "@/components/admin/templates/TemplateType";

export const fetchFooters = createAsyncThunk<
    TemplateDocument[],
    { websiteId?: string | ObjectId; tenantId?: string | ObjectId },
    { state: { footer: FooterState }; rejectValue: string }
>(
    "footer/fetchFooters",
    async ({ websiteId, tenantId }, { rejectWithValue }) => {
        try {
            let url = `/api/admin/footer`;
            const params = new URLSearchParams();
            if (websiteId) params.append('websiteId', websiteId.toString());
            if (tenantId) params.append('tenantId', tenantId.toString());
            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url);
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            console.log("Footers data", data);
            return data?.items || [];
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    },
    {
        // prevent duplicate concurrent fetches
        condition: (_, { getState }) => {
            try {
                const state = getState() as { footer: FooterState };
                return !state.footer.isLoading;
            } catch {
                return true;
            }
        },
    }
);
export const fetchCurrentFooters = createAsyncThunk<
    TemplateDocument[],
    { websiteId?: string | ObjectId; tenantId?: string | ObjectId },
    { state: { footer: FooterState }; rejectValue: string }
>(
    "footer/fetchCurrentFooters",
    async ({ websiteId, tenantId }, { rejectWithValue }) => {
        try {
            let url = `/api/admin/footer`;
            const params = new URLSearchParams();
            if (websiteId) params.append('websiteId', websiteId.toString());
            if (tenantId) params.append('tenantId', tenantId.toString());
            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url);
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            console.log("Footers data", data);
            return data?.items || [];
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    },
    {
        // prevent duplicate concurrent fetches
        condition: (_, { getState }) => {
            try {
                const state = getState() as { footer: FooterState };
                return !state.footer.isLoading;
            } catch {
                return true;
            }
        },
    }
);

export const fetchFooterById = createAsyncThunk<
    TemplateDocument,
    { id: string },
    { rejectValue: string }
>(
    "footer/fetchFooterById",
    async ({ id }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/admin/footer?id=${id}`);
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            console.log("Footer by ID", data);
            return data?.items[0];
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);

export const fetchFooterBySlug = createAsyncThunk<
    TemplateDocument | null,
    { slug: string; websiteId?: string },
    { rejectValue: string }
>(
    "footer/fetchFooterBySlug",
    async ({ slug, websiteId }, { rejectWithValue }) => {
        try {
            const url = websiteId
                ? `/api/admin/footer?slug=${slug}&websiteId=${websiteId}`
                : `/api/admin/footer?slug=${slug}`;
            const res = await fetch(url);
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            console.log("Footer by slug", data);
            const footers = data?.items || [];
            return footers[0] || null;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);

export const createFooter = createAsyncThunk<
    { data: TemplateDocument; success: boolean },
    Omit<TemplateDocument, "_id" | "createdAt" | "updatedAt">,
    { rejectValue: string }
>(
    "footer/createFooter",
    async (footerData, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/admin/footer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(footerData),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            console.log("Created footer", data);
            return data;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);

export const updateFooter = createAsyncThunk<
    TemplateDocument,
    Partial<TemplateDocument> & { _id: string },
    { rejectValue: string }
>(
    "footer/updateFooter",
    async (footerData, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/admin/footer`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(footerData),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            console.log("Updated footer", data);
            return data?.data;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);

export const deleteFooter = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>(
    "footer/deleteFooter",
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/admin/footer`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            console.log("Deleted footer", id);
            return id;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);
