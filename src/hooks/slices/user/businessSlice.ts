import { IBusiness } from '@/models/business';
import { IUser } from '@/models/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BusinessState {
  business: IBusiness[];
  currentBusiness: IBusiness | null;
  isBusinessLoading: boolean;
  hasFetched: boolean;
}

const initialState: BusinessState = {
  business: [],
  currentBusiness: null,
  isBusinessLoading: false,
  hasFetched: false,
};


const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinesses(state, action: PayloadAction<IBusiness[]>) {
      state.business = action.payload;
      state.hasFetched = true;
    },
    setCurrentBusiness(state, action: PayloadAction<IBusiness | null>) {
      state.currentBusiness = action.payload;
    },
    setBusinessLoading(state, action: PayloadAction<boolean>) {
      state.isBusinessLoading = action.payload;
    },
    clearBusinesses(state) {
      state.business = [];
      state.currentBusiness = null;
      state.hasFetched = false;
    },
  },
});

export const {
  setBusinesses,
  setCurrentBusiness,
  setBusinessLoading,
  clearBusinesses,
} = businessSlice.actions;
export default businessSlice.reducer;
