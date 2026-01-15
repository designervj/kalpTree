
import { createAsyncThunk } from "@reduxjs/toolkit";
import { HeaderState } from "./HeaderSlice";
import { ObjectId } from "mongodb";
import { TemplateDocument } from "@/components/admin/templates/TemplateType";

export const fetchHeaders = createAsyncThunk<
    TemplateDocument[],
    { websiteId?: string; tenantId?: string },
    { state: { header: HeaderState }; rejectValue: string }
>(
    "header/fetchHeaders",
    async ({ websiteId, tenantId }, { rejectWithValue }) => {
        try {
            let url = `/api/admin/header`;
            const params = new URLSearchParams();
            if (websiteId) params.append('websiteId', websiteId);
            if (tenantId) params.append('tenantId', tenantId);
            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url);
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            console.log("Headers data", data);
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
                const state = getState() as { header: HeaderState };
                return !state.header.isLoading;
            } catch {
                return true;
            }
        },
    }
);
export const fetchCurrentHeaders = createAsyncThunk<
    TemplateDocument[],
    { websiteId?: string|ObjectId; tenantId?: string|ObjectId },
    { state: { header: HeaderState }; rejectValue: string }
>(
    "header/fetchCurrentHeaders",
    async ({ websiteId, tenantId }, { rejectWithValue }) => {
        try {
            let url = `/api/admin/header`;
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
            console.log("Headers data", data);
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
                const state = getState() as { header: HeaderState };
                return !state.header.isLoading;
            } catch {
                return true;
            }
        },
    }
);

export const fetchHeaderById = createAsyncThunk<
    TemplateDocument,
    { id: string },
    { rejectValue: string }
>(
    "header/fetchHeaderById",
    async ({ id }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/admin/header/${id}`);
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            console.log("Header by ID", data);
            return data?.data;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);

export const fetchHeaderBySlug = createAsyncThunk<
    TemplateDocument | null,
    { slug: string; websiteId?: string },
    { rejectValue: string }
>(
    "header/fetchHeaderBySlug",
    async ({ slug, websiteId }, { rejectWithValue }) => {
        try {
            const url = websiteId
                ? `/api/admin/header?slug=${slug}&websiteId=${websiteId}`
                : `/api/admin/header?slug=${slug}`;
            const res = await fetch(url);
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            console.log("Header by slug", data);
            const headers = data?.items || [];
            return headers[0] || null;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);

export const createHeader = createAsyncThunk<
    { data: TemplateDocument; success: boolean },
    Omit<TemplateDocument, "_id" | "createdAt" | "updatedAt">,
    { rejectValue: string }
>(
    "header/createHeader",
    async (headerData, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/admin/header`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(headerData),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            console.log("Created header", data);
            return data;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);

export const updateHeader = createAsyncThunk<
    TemplateDocument,
    Partial<TemplateDocument> & { _id: string },
    { rejectValue: string }
>(
    "header/updateHeader",
    async (headerData, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/admin/header`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(headerData),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            console.log("Updated header", data);
            return data?.data;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);

export const deleteHeader = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>(
    "header/deleteHeader",
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/admin/header`, {
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
            console.log("Deleted header", id);
            return id;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);
