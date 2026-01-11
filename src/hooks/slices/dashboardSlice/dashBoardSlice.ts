import { PageModel } from "@/types/pages/PageModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// Thunk to save page (async)

import { AppDispatch, RootState } from "@/store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { pageService } from "@/modules/website/page-service";
import { User, Website } from "@/components/admin/AppShell";
import { IBusiness } from "@/models/business";

const applyAgencyChange = (state: dashboardDetailsState, agencyId: string) => {
  const selectedAgency = state.agencies.find((d) => d._id === agencyId);
  if (!selectedAgency) return;

  state.currentAgency = selectedAgency;
  state.business = state.totalbusiness.filter(
    (d) => d.tenantId === selectedAgency._id
  );
  const selectedBusiness = state.business[0];
  if (!selectedBusiness) return;

  state.currentbusiness = selectedBusiness;
  state.websites = state.totalwebsites.filter(
    (d) => d.tenantId === selectedBusiness._id
  );

  state.currentWebsite = state.websites[0] ?? null;
};

const applyBusinessChange = (
  state: dashboardDetailsState,
  businessid: string
) => {
  const selectedBusiness = state.business.find((d) => d._id == businessid);
  if (!selectedBusiness) return;
  state.currentbusiness = selectedBusiness;
  state.websites = state.totalwebsites.filter(
    (d) => d.tenantId === selectedBusiness._id
  );
  state.currentWebsite = state.websites[0] ?? null;
};

const applyWebSiteChange = (
  state: dashboardDetailsState,
  websiteid: string
) => {
  state.currentWebsite = state.websites.find((d) => d._id == websiteid) ?? null;
};

interface dashboardDetailsState {
  agencies: any[];
  currentAgency: any | null;
  business: any[];
  currentbusiness: IBusiness | null;
  websites: Website[];
  currentWebsite: Website | null;
  loggedinTenant: any | null;
  loading: boolean;
  user: User | null;
  error: string | undefined;
  totalbusiness: any[];
  totalwebsites: Website[];
}

const initialState: dashboardDetailsState = {
  agencies: [],
  currentAgency: null,
  business: [],
  totalbusiness: [],
  currentbusiness: null,
  websites: [],
  totalwebsites: [],
  currentWebsite: null,
  loggedinTenant: null,
  loading: false,
  user: null,
  error: undefined,
};
// Thunk to save page via API
export const savedashboardDetailsThunk = createAsyncThunk(
  "dashboard/savedashboard",
  async () => {
    try {
      const response = await fetch(`/api/appshell-data`);
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to save page");

      return data;
    } catch (error) {
      // Optionally handle error (e.g., show toast)
      throw error;
    }
  }
);

export const dashboardDetailsSlice = createSlice({
  name: "dashboardDetails",
  initialState,
  reducers: {
    onAgencyChange: (state, action) => {
      const { agencyId } = action.payload;
      applyAgencyChange(state, agencyId);
    },
    onParamsChange: (state, action) => {
      const { agencyid, businessid, url } = action.payload;
      const decode = decodeURIComponent(url);
      console.log(decode);
      if (agencyid && businessid && url) {
        applyAgencyChange(state, agencyid);
        state.currentbusiness = state.totalbusiness.find(
          (d) => d._id == businessid
        );
        state.currentWebsite =
          state.totalwebsites.find((d) => d.primaryDomain?.includes(decode)) ??
          null;
      } else if (businessid && url) {
        applyBusinessChange(state, businessid);
        state.currentWebsite =
          state.websites.find((d) => d.primaryDomain?.includes(decode)) ?? null;
      } else if (url) {
        applyWebSiteChange(state, url);
      }
    },
    onBusinessChange: (state, action) => {
      const { tenantId } = action.payload;
      applyBusinessChange(state, tenantId);
    },
    onWebSiteChange: (state, action) => {
      const { websiteId } = action.payload;
      applyWebSiteChange(state, websiteId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savedashboardDetailsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(savedashboardDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { agencies, business, websites, user } = action.payload;
        if (agencies) {
          state.agencies = agencies;
        }
        if (business) {
          state.totalbusiness = business;
          if (
            user.role !== "superadmin" &&
            (user.role == "agency" || user.permissions.includes("agency:read"))
          ) {
            state.business = business;
          }
        }
        if (websites) {
          state.totalwebsites = websites;
          if (
            user.role != "superadmin" &&
            user.role != "agency" &&
            (user.role == "business" ||
              user.permissions.includes("websites:read"))
          ) {
            state.websites = websites;
          }
        }
        state.loggedinTenant = action.payload.loggedinTenant;
        state.user = action.payload.user;
      })
      .addCase(savedashboardDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  onAgencyChange,
  onParamsChange,
  onBusinessChange,
  onWebSiteChange,
} = dashboardDetailsSlice.actions;
export default dashboardDetailsSlice.reducer;
