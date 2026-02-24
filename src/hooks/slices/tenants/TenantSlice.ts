import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TenantState {
  tenants: any[];
  currentTenants: any | null;
}

const initialState: TenantState = {
  tenants: [],
  currentTenants: null,
};

const tenantsSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {
    setTenants(state, action: PayloadAction<any[]>) {
      state.tenants = action.payload;
      if (!state.currentTenants && action.payload.length > 0) {
        state.currentTenants = action.payload[0];
      }
    },
    clearTenants(state) {
      state.tenants = [];
      state.currentTenants = null;
    },
    setCurrentTenants(state, action: PayloadAction<any | null>) {
      state.currentTenants = action.payload;
    },
  },
});

export const { setTenants, clearTenants, setCurrentTenants } = tenantsSlice.actions;
export default tenantsSlice.reducer;
