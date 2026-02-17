
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "@/store/store";
// Adjust the import path for Website if needed
import { Website } from "@/components/admin/AppShell";
import { savedashboardDetailsThunk } from "../dashboardSlice/dashBoardSlice";
import { getAllWebsites, getCurrentWebsites, updateWebsite } from "./WebsiteThunk";

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
    addCreatedWebsite(state, action: PayloadAction<Website>) {
      state.websites.unshift(action.payload);
      // state.selectedWebsites.unshift(action.payload);
      state.currentWebsite = action.payload;
    },
    updateCurrentWebsiteGlobalStyle(state, action: PayloadAction<string>) {
      if (state.currentWebsite) {
        state.currentWebsite.globalStyle = action.payload;
      }
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
        const { websites, user, business, businessid } = action.payload;
        if (websites && business && businessid) {
          state.websites = websites;

          state.hasfetched = true
          const allwebsites = websites.filter((item: Website) => item.tenantId === businessid)
          if (allwebsites) {
            state.selectedWebsites = allwebsites
            state.currentWebsite = allwebsites[0]
            // state.currentWebsite = allwebsites[0]
          }
        }
      })
      .addCase(savedashboardDetailsThunk.rejected, (state, action) => {
        state.isLoading = false
      })

      //get current website

      .addCase(getCurrentWebsites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWebsite = action.payload[0]
      })

      // upadate website
      .addCase(updateWebsite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWebsite = action.payload

        // update website in websites array
        state.websites = state.websites.map((item: Website) => item._id === action.payload._id ? action.payload : item)
        state.selectedWebsites = state.selectedWebsites.map((item: Website) => item._id === action.payload._id ? action.payload : item) 
      })
      ;
  },
});

export const { setWebsites,
  clearWebsites, setCurrentWebsite,
  setSelectedWebsite, addCreatedWebsite, updateCurrentWebsiteGlobalStyle } = websitesSlice.actions;
export default websitesSlice.reducer;
