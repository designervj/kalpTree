
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "@/store/store";
// Adjust the import path for Website if needed
import { Website } from "@/components/admin/AppShell";
import { savedashboardDetailsThunk } from "../dashboardSlice/dashBoardSlice";

interface WebsitesState {
  websites: Website[];
  currentWebsite: Website | null;
  hasfetched: boolean
  isLoading: boolean
}

const initialState: WebsitesState = {
  websites: [],
  currentWebsite: null,
  hasfetched: false,
  isLoading: false
};


const websitesSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {
    setWebsites(state, action: PayloadAction<Website[]>) {
      state.websites = action.payload;
      // If currentWebsite is not set, pick the first one
      if (!state.currentWebsite && action.payload.length > 0) {
        state.currentWebsite = action.payload[0];
      }
    },
    clearWebsites(state) {
      state.websites = [];
      state.currentWebsite = null;
    },
    setCurrentWebsite(state, action: PayloadAction<Website | null>) {
      state.currentWebsite = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllWebsites.pending, (state) => {
        state.hasfetched = false;
      })
      .addCase(getAllWebsites.fulfilled, (state, action) => {
        state.websites = action.payload;
        state.hasfetched = true;
      })
      .addCase(getAllWebsites.rejected, (state) => {
        state.hasfetched = false;
      })
      .addCase(savedashboardDetailsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(savedashboardDetailsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const { websites, user } = action.payload;
        if (websites) {
          state.websites = websites;
         state.currentWebsite=websites[0]
         state.hasfetched=true
        }
      })
      .addCase(savedashboardDetailsThunk.rejected, (state, action) => {
       state.isLoading=false
      });
  },
});

export const { setWebsites, clearWebsites, setCurrentWebsite } = websitesSlice.actions;
export default websitesSlice.reducer;

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
  { tenantId: string },
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
      return data.items as Website[];
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