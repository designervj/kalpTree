import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// Thunks for CRUD operations

import { WebsitePageModel } from "../../../components/admin/website/websitePage/WebsitePageType";
import { ObjectId } from "mongodb";
import { createWebsitePage, deleteWebsitePage, fetchWebsitePages, updateWebsitePage } from "./WebsitePageThunk";

interface WebsitePageState {
  websitePages: WebsitePageModel[];
  currentpage:WebsitePageModel|null;
  hasFetched: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: WebsitePageState = {
  websitePages: [],
  currentpage:null,
  hasFetched: false,
  isLoading: false,
  error: null,
};

const websitePageSlice = createSlice({
  name: "websitePage",
  initialState,
  reducers: {
    updateCurrentPage:(state, action)=>{
        state.currentpage=action.payload
    },
    setAllWebsitePages: (state, action) => {
      state.websitePages = action.payload
      state.hasFetched = true
    },
     updateWebsitePages: (state, action) => {
      state.websitePages.push(action.payload)
    },
    clearWebsitePages:(state)=>{
      state.websitePages=[]
      state.hasFetched=false
      state.isLoading=false
      state.error=null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWebsitePages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWebsitePages.fulfilled, (state, action) => {
        state.websitePages = action.payload;
        state.isLoading = false;
        state.hasFetched = true;
      })
      .addCase(fetchWebsitePages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch pages";
      })

      // Create
      .addCase(createWebsitePage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWebsitePage.fulfilled, (state, action) => {
        state.websitePages.push(action.payload);
      })

      // Update

      .addCase(updateWebsitePage.fulfilled, (state, action) => {
        const idx = state.websitePages.findIndex(
          (p) => p._id === action.payload._id
        );

        if (idx !== -1) state.websitePages[idx] = action.payload;

        // update isHomePage
        if (action.payload.isHomePage) {
          state.websitePages.forEach((p) => {
            if (p._id !== action.payload._id) p.isHomePage = false;
          });
        }
      })
      // Delete
      .addCase(deleteWebsitePage.fulfilled, (state, action) => {
        state.websitePages = state.websitePages.filter(
          (p) => p._id !== action.payload
        );
      });
  },
});

export const {
updateCurrentPage,
 setAllWebsitePages,
 updateWebsitePages,
 clearWebsitePages
} = websitePageSlice.actions;

export default websitePageSlice.reducer;
