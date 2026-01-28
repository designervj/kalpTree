import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// Thunks for CRUD operations
export const fetchWebsitePages = createAsyncThunk<
  WebsitePageModel[],
  string|ObjectId,
  { rejectValue: string }
>("websitePage/fetchWebsitePages", async (websiteId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/pages/websites?websiteId=${websiteId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch pages");
    }
    const data = await response.json();
    console.log("data web pages", data);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch pages");
  }
});

export const createWebsitePage = createAsyncThunk<
  WebsitePageModel,
  Partial<WebsitePageModel>,
  { rejectValue: string }
>("websitePage/createWebsitePage", async (page, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/pages/websites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(page),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create page");
    }
    const data = await response.json();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to create page");
  }
});

export const updateWebsitePage = createAsyncThunk<
  WebsitePageModel,
  WebsitePageModel,
  { rejectValue: string }
>("websitePage/updateWebsitePage", async (page, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/pages/websites`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(page),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update page");
    }
    const data = await response.json();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update page");
  }
});

export const deleteWebsitePage = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("websitePage/deleteWebsitePage", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/pages/websites?id=${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete page"
    );
  }
});
import { WebsitePageModel } from "../../../components/admin/website/websitePage/WebsitePageType";
import { ObjectId } from "mongodb";

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
