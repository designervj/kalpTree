import { createAsyncThunk } from "@reduxjs/toolkit";
import { GlobalStyleState } from "./GlobalStyleSlice";
import { GlobalStyleSettings } from "@/components/admin/settings/global-styles/GlobalStyleModal";

export const fetchGlobalStyle = createAsyncThunk<
    GlobalStyleSettings,
    void,
    { rejectValue: string }
>(
    "globalStyle/fetchGlobalStyle",
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/admin/globalStyle`);
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            return data?.data;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    },
    {
        condition: (_, { getState }) => {
            try {
                const state = getState() as { globalStyle: GlobalStyleState };
                return !state.globalStyle.isLoading;
            } catch {
                return true;
            }
        },
    }
);

export const createGlobalStyle = createAsyncThunk<
    { data: GlobalStyleSettings; success: boolean },
    { globalStyle: string; tenantId: string },
    { rejectValue: string }
>(
    "globalStyle/createGlobalStyle",
    async (styleData, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/admin/globalStyle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(styleData),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                return rejectWithValue(body?.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);

export const deleteGlobalStyle = createAsyncThunk<
    string,
    { id: string },
    { rejectValue: string }
>(
    "globalStyle/deleteGlobalStyle",
    async ({ id }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/admin/globalStyle`, {
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
            return id;
        } catch (error: unknown) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Network error"
            );
        }
    }
);
