import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ColorPalletModal } from "@/components/admin/branding/color_pallet/Color_Pallet_Modal";
import {
    getAllColorPallets,
    createColorPallet,
    updateColorPallet,
    deleteColorPallet,
} from "./ColorPalletThunk";

interface ColorPalletState {
    colorPallets: ColorPalletModal[];
    isLoading: boolean;
    currentColorPallet: ColorPalletModal | null;
    isError: boolean;
    isFetched: boolean;
}

const initialState: ColorPalletState = {
    colorPallets: [],
    isLoading: false,
    currentColorPallet: null,
    isError: false,
    isFetched: false,
};

const ColorPalletSlice = createSlice({
    name: "colorPallet",
    initialState,
    reducers: {
        setColorPallets: (state, action: PayloadAction<ColorPalletModal[]>) => {
            state.colorPallets = action.payload;
            state.isFetched = true;
        },
        setCurrentColorPallet: (state, action: PayloadAction<ColorPalletModal | null>) => {
            state.currentColorPallet = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<boolean>) => {
            state.isError = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All
            .addCase(getAllColorPallets.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllColorPallets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.colorPallets = action.payload;
                state.isFetched = true;
            })
            .addCase(getAllColorPallets.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            // Create
            .addCase(createColorPallet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createColorPallet.fulfilled, (state, action) => {
                state.isLoading = false;
                state.colorPallets.push(action.payload);
            })
            .addCase(createColorPallet.rejected, (state) => {
                state.isLoading = false;
            })
            // Update
            .addCase(updateColorPallet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateColorPallet.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.colorPallets.findIndex((cp) => cp._id === action.payload._id);
                if (index !== -1) {
                    state.colorPallets[index] = action.payload;
                }
                if (state.currentColorPallet?._id === action.payload._id) {
                    state.currentColorPallet = action.payload;
                }
            })
            .addCase(updateColorPallet.rejected, (state) => {
                state.isLoading = false;
            })
            // Delete
            .addCase(deleteColorPallet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteColorPallet.fulfilled, (state, action) => {
                state.isLoading = false;
                state.colorPallets = state.colorPallets.filter((cp) => cp._id !== action.payload);
                if (state.currentColorPallet?._id === action.payload) {
                    state.currentColorPallet = null;
                }
            })
            .addCase(deleteColorPallet.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {
    setColorPallets,
    setCurrentColorPallet,
    setLoading,
    setError,
} = ColorPalletSlice.actions;

export default ColorPalletSlice.reducer;
