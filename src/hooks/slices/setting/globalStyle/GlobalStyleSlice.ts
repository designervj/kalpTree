import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createGlobalStyle, deleteGlobalStyle, fetchGlobalStyle } from "./GlobalStyleThunk";
import { GlobalStyleSettings } from "@/components/admin/settings/global-styles/GlobalStyleModal";

export type GlobalStyleState = {
    globalStyle: GlobalStyleSettings | null;
    isLoading: boolean;
    isError: boolean;
};

const initialState: GlobalStyleState = {
    globalStyle: null,
    isLoading: false,
    isError: false,
};

const globalStyleSlice = createSlice({
    name: "globalStyle",
    initialState,
    reducers: {
        setGlobalStyle(state, action: PayloadAction<GlobalStyleSettings | null>) {
            state.globalStyle = action.payload;
        },
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setIsError(state, action: PayloadAction<boolean>) {
            state.isError = action.payload;
        },
        resetGlobalStyle(state) {
            state.globalStyle = null;
            state.isLoading = false;
            state.isError = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Global Style
            .addCase(fetchGlobalStyle.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchGlobalStyle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.globalStyle = action.payload
            })
            .addCase(fetchGlobalStyle.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            // Create/Update Global Style
            .addCase(createGlobalStyle.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(createGlobalStyle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.globalStyle = action.payload.data
            })
            .addCase(createGlobalStyle.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            // Delete Global Style
            .addCase(deleteGlobalStyle.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(deleteGlobalStyle.fulfilled, (state) => {
                state.isLoading = false;
                state.globalStyle = null;
            })
            .addCase(deleteGlobalStyle.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});

export const {
    setGlobalStyle,
    setIsLoading,
    setIsError,
    resetGlobalStyle,
} = globalStyleSlice.actions;

export default globalStyleSlice.reducer;

export const selectGlobalStyle = (state: { globalStyle: GlobalStyleState }) =>
    state.globalStyle.globalStyle;

export const selectIsGlobalStyleLoading = (state: { globalStyle: GlobalStyleState }) =>
    state.globalStyle.isLoading;

export const selectIsGlobalStyleError = (state: { globalStyle: GlobalStyleState }) =>
    state.globalStyle.isError;
