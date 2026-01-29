import { Website } from "@/components/admin/AppShell";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ObjectId } from "mongodb";

// Thunk to create a Website (createD Website)
export const createWebsite = createAsyncThunk<
  Website,
  Partial<Website>,
  { rejectValue: string }
>(
  "websites/createWebsite",
  async (websiteData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/domain/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(websiteData),
      });
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.error || "Failed to create website");
      }
      const data = await res.json();
      return data.item as Website;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create website");
    }
  }
);

// Thunk to get all Websites for a tenant/user
export const getAllWebsites = createAsyncThunk<
  Website[],
  { tenantId?: string | ObjectId},
  { rejectValue: string }
>(
  "websites/getAllWebsites",
  async ({ tenantId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/domain/website?tenantId=${tenantId}`);
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.error || "Failed to fetch websites");
      }
      const data = await res.json();
      return data.item as Website[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch websites");
    }
  }
);
export const getCurrentWebsites = createAsyncThunk<
  Website[],
  { id?: string | ObjectId},
  { rejectValue: string }
>(
  "websites/getCurrentWebsites",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/domain/website?id=${id}`);
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.error || "Failed to fetch websites");
      }
      const data = await res.json();
      return data.item as Website[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch websites");
    }
  }
);
// Thunk to delete a Website by _id (ObjectId)
export const deleteWebsite = createAsyncThunk<
  string, // returns deleted _id
  string, // expects _id as argument
  { rejectValue: string }
>(
  "websites/deleteWebsite",
  async (_id, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/domain/website", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: _id }),
      });
      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.error || "Failed to delete website");
      }
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete website");
    }
  }
);

// create method update website
export const updateWebsite = createAsyncThunk<
    Website,
    { id: string|ObjectId; websiteData: Partial<Website> },
    { rejectValue: string }
>(
    "websites/updateWebsite",
    async ({ id, websiteData }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/domain/website?id=${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(websiteData),
            });
            if (!res.ok) {
                const error = await res.json();
                return rejectWithValue(error.error || "Failed to update website");
            }
            const data = await res.json();
            return data.item as Website;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to update website");
        }
    }
);  