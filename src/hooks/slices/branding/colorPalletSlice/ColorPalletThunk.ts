import { createAsyncThunk } from "@reduxjs/toolkit";
import { ColorPalletModal } from "@/components/admin/branding/color_pallet/Color_Pallet_Modal";

const API_BASE = "/api/admin/color-pallet";

export const getAllColorPallets = createAsyncThunk<
    ColorPalletModal[],
    void,
    { rejectValue: string }
>(
    "colorPallet/getAllColorPallets",
    async (_, { rejectWithValue }) => {
        try {
            let url = API_BASE;
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok || !data.success) {
                return rejectWithValue(data.message || "Failed to fetch color pallets");
            }
            return data.data as ColorPalletModal[];
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to fetch color pallets");
        }
    }
);

export const createColorPallet = createAsyncThunk<
    ColorPalletModal,
    { websiteId: string; palletData: Partial<ColorPalletModal> },
    { rejectValue: string }
>(
    "colorPallet/createColorPallet",
    async ({ websiteId, palletData }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_BASE}?websiteId=${websiteId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(palletData),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                return rejectWithValue(data.message || "Failed to create color pallet");
            }
            // The API returns the new _id in data.data
            return { ...palletData, _id: data.data } as ColorPalletModal;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to create color pallet");
        }
    }
);

export const updateColorPallet = createAsyncThunk<
    ColorPalletModal,
    { websiteId: string; palletId: string; palletData: Partial<ColorPalletModal> },
    { rejectValue: string }
>(
    "colorPallet/updateColorPallet",
    async ({ websiteId, palletId, palletData }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_BASE}?websiteId=${websiteId}&palletId=${palletId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(palletData),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                return rejectWithValue(data.message || "Failed to update color pallet");
            }
            return { ...palletData, _id: palletId } as ColorPalletModal;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to update color pallet");
        }
    }
);

export const deleteColorPallet = createAsyncThunk<
    string,
    { websiteId: string; palletId: string },
    { rejectValue: string }
>(
    "colorPallet/deleteColorPallet",
    async ({ websiteId, palletId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_BASE}?websiteId=${websiteId}&palletId=${palletId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                return rejectWithValue(data.message || "Failed to delete color pallet");
            }
            return palletId;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to delete color pallet");
        }
    }
);
