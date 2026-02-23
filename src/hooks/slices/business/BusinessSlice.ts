import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBusiness } from "@/models/business";
import {
  fetchAllBusinesses,
  fetchBusinessById,
  fetchBusinessBySlug,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  fetchBusinessesByTenant,
  fetchBusinessesByPlan,
  searchBusinesses,
  updateBusinessBranding,
} from "./BusinessThunk";
import { savedashboardDetailsThunk } from "../dashboardSlice/dashBoardSlice";
import { deleteAgency } from "../user/agencySlice";

export interface Pagination {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  itemsPerPage: number;
  page: number;
  totalCount: number;
  totalPages: 1;
}

interface BusinessState {
  allBusiness: IBusiness[];
  allSelectedBusiness: IBusiness[];
  businessWebsite: IBusiness | null;
  currentBusiness: IBusiness | null;
  editBusiness: IBusiness | null;
  hasFetchedBusiness: boolean;
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: BusinessState = {
  allBusiness: [],
  allSelectedBusiness: [],
  businessWebsite: null,
  currentBusiness: null,
  editBusiness: null,
  hasFetchedBusiness: false,
  isLoading: false,
  error: null,
  pagination: null,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusinesses(state, action: PayloadAction<IBusiness[]>) {
      state.allBusiness = action.payload;
      state.hasFetchedBusiness = true;
    },
    setSelectedBusiness: (state, action) => {
      state.allSelectedBusiness = action.payload;
    },
    setBusinessWebsite: (state, action) => {
      state.businessWebsite = action.payload;
    },
    setEditBusiness: (state, action) => {
      state.editBusiness = action.payload;
    },
    setCurrentBusiness(state, action: PayloadAction<IBusiness | null>) {
      state.currentBusiness = action.payload;
    },
    addCreatedBusiness(state, action: PayloadAction<IBusiness>) {
      state.allBusiness.unshift(action.payload);
    },
    clearBusinesses(state) {
      state.allBusiness = [];
      state.currentBusiness = null;
      state.hasFetchedBusiness = false;
      state.allSelectedBusiness = [];
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all businesses
      .addCase(fetchAllBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBusinesses.fulfilled, (state, action) => {
        const { data, pagination } = action.payload;
        state.isLoading = false;
        state.allBusiness = data;
        state.pagination = pagination;
        state.hasFetchedBusiness = true;
      })
      .addCase(fetchAllBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch business by ID
      .addCase(fetchBusinessById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.isLoading = false;

        const { businessId, business } = action.payload;
        state.allBusiness = business;
        // Also update in allBusiness array if it exists
        const index = state.allBusiness.findIndex(
          (b) => b._id?.toString() === businessId.toString(),
        );
        if (index !== -1) {
          state.businessWebsite = business[index];
        }
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch business by slug
      .addCase(fetchBusinessBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBusiness = action.payload;
        // Also update in allBusiness array if it exists
        const index = state.allBusiness.findIndex(
          (b) => b._id?.toString() === action.payload._id?.toString(),
        );
        if (index !== -1) {
          state.allBusiness[index] = action.payload;
        } else {
          state.allBusiness.push(action.payload);
        }
      })
      .addCase(fetchBusinessBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create business
      .addCase(createBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allBusiness.push(action.payload);
        state.currentBusiness = action.payload;
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update business
      .addCase(updateBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        const { business } = action.payload;
        const index = state.allBusiness.findIndex(
          (b) => b._id?.toString() === business._id?.toString(),
        );
        if (index !== -1) {
          state.allBusiness[index] = business;
        }
        // Update currentBusiness if it's the same one
        if (
          state.currentBusiness?._id?.toString() === business._id?.toString()
        ) {
          state.currentBusiness = business;
        }
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete business
      .addCase(deleteBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload.deletedId;
        // Remove from allBusiness array
        state.allBusiness = state.allBusiness.filter(
          (b: IBusiness) => b._id?.toString() !== deletedId,
        );
        // Clear currentBusiness if it was the deleted one
        if (state.currentBusiness?._id?.toString() === deletedId) {
          state.currentBusiness =
            state.allBusiness.length > 0 ? state.allBusiness[0] : null;
        }
      })
      .addCase(deleteBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch businesses by tenant
      .addCase(fetchBusinessesByTenant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessesByTenant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allBusiness = action.payload;
        state.hasFetchedBusiness = true;
      })
      .addCase(fetchBusinessesByTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch businesses by plan
      .addCase(fetchBusinessesByPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessesByPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allBusiness = action.payload;
        state.hasFetchedBusiness = true;
      })
      .addCase(fetchBusinessesByPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search businesses
      .addCase(searchBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allBusiness = action.payload;
      })
      .addCase(searchBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(savedashboardDetailsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(savedashboardDetailsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const { business, user, agencies, agencyid, businessid } =
          action.payload;

        if (business && agencies && agencyid) {
          state.allBusiness = business;
          const allBus = business.filter(
            (item: IBusiness) => item.tenantId === agencyid,
          );
          state.allSelectedBusiness = allBus;
          state.currentBusiness = allBus[0];
          state.hasFetchedBusiness = true;
        }
      })
      .addCase(savedashboardDetailsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //update business profile
      .addCase(updateBusinessBranding.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBusinessBranding.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data } = action.payload;
        state.currentBusiness = data;
        // update in allBusiness array if it exists
        const index = state.allBusiness.findIndex(
          (b: IBusiness) => b._id?.toString() === data._id?.toString(),
        );
        if (index !== -1) {
          state.allBusiness[index] = data;
        }
      })
      .addCase(updateBusinessBranding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //on delete agenct delete business
      .addCase(deleteAgency.fulfilled, (state, action) => {
        const { success, agencyId } = action.payload;
        state.allBusiness = state.allBusiness.filter(
          (b: IBusiness) => b.tenantId !== agencyId,
        );
        state.allSelectedBusiness = state.allSelectedBusiness.filter(
          (b: IBusiness) => b.tenantId !== agencyId,
        );
      });
  },
});

export const {
  setBusinesses,
  clearBusinesses,
  setCurrentBusiness,
  setSelectedBusiness,
  setBusinessWebsite,
  setEditBusiness,
  setLoading,
  setError,
  addCreatedBusiness,
} = businessSlice.actions;

export default businessSlice.reducer;
