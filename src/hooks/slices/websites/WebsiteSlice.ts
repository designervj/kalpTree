
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "@/store/store";
// Adjust the import path for Website if needed
import { Website } from "@/components/admin/AppShell";
import { savedashboardDetailsThunk } from "../dashboardSlice/dashBoardSlice";
import { getAllWebsites } from "./WebsiteThunk";

interface WebsitesState {
  websites: Website[];
  selectedWebsites: Website[];
  currentWebsite: Website | null;
  hasfetched: boolean
  isLoading: boolean
}

const initialState: WebsitesState = {
  websites: [],
  selectedWebsites: [],
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
    setSelectedWebsite: (state, action) => {
      state.selectedWebsites = action.payload
      state.currentWebsite = action.payload[0]
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
        const { websites, user, business } = action.payload;
        if (websites && business) {
          state.websites = websites;

          state.hasfetched = true
          const allwebsites = websites.filter((item: Website) => item.tenantId === business[0]?._id)
          if (allwebsites) {
            state.selectedWebsites = allwebsites
            state.currentWebsite = allwebsites[0]
          }
        }
      })
      .addCase(savedashboardDetailsThunk.rejected, (state, action) => {
        state.isLoading = false
      });
  },
});

export const { setWebsites, clearWebsites, setCurrentWebsite, setSelectedWebsite } = websitesSlice.actions;
export default websitesSlice.reducer;
