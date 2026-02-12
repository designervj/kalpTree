import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createGlobalStyle, deleteGlobalStyle, fetchGlobalStyle } from "./GlobalStyleThunk";
import { GlobalStyleSettings } from "@/components/admin/settings/global-styles/GlobalStyleModal";

export type GlobalStyleState = {
    style: GlobalStyleSettings[] | null;
    currentStyle: GlobalStyleSettings | null;
    isFetched: boolean;
    isLoading: boolean;
    isError: boolean;
};

const initialState: GlobalStyleState = {
    style: null,
    currentStyle: null,
    isFetched: false,
    isLoading: false,
    isError: false,
};

const globalStyleSlice = createSlice({
    name: "globalStyle",
    initialState,
    reducers: {
        setGlobalStyle(state, action: PayloadAction<GlobalStyleSettings | null>) {
        //   state.style = action.payload;
        },
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setIsError(state, action: PayloadAction<boolean>) {
            state.isError = action.payload;
        },
        resetGlobalStyle(state) {
            state.style = null;
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
               state.isFetched = true;
               if(state.style){
                state.style.push(action.payload)
                state.currentStyle = action.payload
               }else{
                state.style = [action.payload]
                state.currentStyle = action.payload
               }
                state.isLoading = false;
            })
            .addCase(fetchGlobalStyle.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
         
    },
});

export const {
    setGlobalStyle,
    setIsLoading,
    setIsError,
    resetGlobalStyle,
} = globalStyleSlice.actions;

export default globalStyleSlice.reducer;


