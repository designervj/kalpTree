import { createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to delete an agency by id
export const deleteAgency = createAsyncThunk<
  string, // return type (deleted agency id)
  string, // argument type (agency id)
  { rejectValue: string }
>(
  'agency/deleteAgency',
  async (agencyId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/agency?id=${agencyId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      return agencyId;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to delete agency');
    }
  }
);

import { IUser } from '@/models/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { savedashboardDetailsThunk } from '../dashboardSlice/dashBoardSlice';

interface AgencyState {
  agencies: IUser[];
  hasfetched: boolean;
  isAgencyLoading: boolean;
  curretAgency: IUser | null;
}

const initialState: AgencyState = {
  agencies: [],
  hasfetched: false,
  isAgencyLoading: false,
  curretAgency: null,
};


const agencySlice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    setAgencies(state, action: PayloadAction<IUser[]>) {
      state.agencies = action.payload;
      state.hasfetched = true;
    },
    setAgencyLoading(state, action: PayloadAction<boolean>) {
      state.isAgencyLoading = action.payload;
    },
    setCurretAgency(state, action: PayloadAction<IUser | null>) {
      state.curretAgency = action.payload;
    },
    clearAgencies(state) {
      state.agencies = [];
      state.hasfetched = false;
      state.curretAgency = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteAgency.pending, (state) => {
        state.isAgencyLoading = true;
      })
      .addCase(deleteAgency.fulfilled, (state, action) => {
        state.isAgencyLoading = false;
        state.agencies = state.agencies.filter(a => a._id !== action.payload);
      })
      .addCase(deleteAgency.rejected, (state) => {
        state.isAgencyLoading = false;
      })
    .addCase(savedashboardDetailsThunk.pending, (state) => {
          state.isAgencyLoading = true;
        })
        .addCase(savedashboardDetailsThunk.fulfilled, (state, action) => {
          state.isAgencyLoading = false;
          const { agencies } = action.payload;
          if (agencies) {
            state.agencies = agencies;
            state.curretAgency = agencies[0];
            state.hasfetched = true;
          }
        })
        .addCase(savedashboardDetailsThunk.rejected, (state, action) => {
          state.isAgencyLoading = false;
        });
}});

export const { setAgencies, setAgencyLoading, setCurretAgency, clearAgencies } = agencySlice.actions;
export default agencySlice.reducer;
