import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaterialBrandModel } from "@/components/admin/brand/types/brandModel";

export type BrandState = {
  listBrand: MaterialBrandModel[];
  isBrandLoading: boolean;
  hasFetched: boolean;
};

const initialState: BrandState = {
  listBrand: [],
  isBrandLoading: false,
  hasFetched: false,
};

export const fetchBrands = createAsyncThunk<
  MaterialBrandModel[],
  { websiteId: string },
  { state: { brand: BrandState }; rejectValue: string }
>(
  "brand/fetchBrands",
  async ({ websiteId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/brand?websiteId=${websiteId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data?.items || [];
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Network error"
      );
    }
  },
  {
    condition: (_, { getState }) => {
      try {
        const state = getState() as { brand: BrandState };
        return !state.brand.isBrandLoading;
      } catch {
        return true;
      }
    },
  }
);

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setBrands(state, action: PayloadAction<MaterialBrandModel[]>) {
      state.listBrand = action.payload;
    },
    addBrand(state, action: PayloadAction<MaterialBrandModel>) {
      state.listBrand.push(action.payload);
    },
    updateBrand(state, action: PayloadAction<MaterialBrandModel>) {
      const updated = action.payload;
      const idx = state.listBrand.findIndex((c) => {
        if (!c) return false;
        if ((c as any)._id && (updated as any)._id)
          return String((c as any)._id) === String((updated as any)._id);
        if (c.id && updated.id) return String(c.id) === String(updated.id);
        return c.name === updated.name;
      });
      if (idx !== -1) {
        state.listBrand[idx] = {
          ...state.listBrand[idx],
          ...updated,
        };
      }
    },
    removeBrand(state, action: PayloadAction<string | number | undefined>) {
      const id = action.payload;
      state.listBrand = state.listBrand.filter((c) => {
        if (!c) return false;
        if ((c as any)._id && id) return String((c as any)._id) !== String(id);
        if (c.id && id) return String(c.id) !== String(id);
        return c.name !== String(id);
      });
    },
    clearBrands(state) {
      state.listBrand = [];
      state.hasFetched = false;
      state.isBrandLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.isBrandLoading = true;
      })
      .addCase(
        fetchBrands.fulfilled,
        (state, action: PayloadAction<MaterialBrandModel[]>) => {
          if (action.payload && action.payload.length) {
            state.listBrand = action.payload;
            state.hasFetched = true;
            state.isBrandLoading = false;
          }
        }
      )
      .addCase(fetchBrands.rejected, (state) => {
        state.isBrandLoading = false;
      });
  },
});

export const {
  setBrands,
  addBrand,
  updateBrand,
  removeBrand,
  clearBrands,
} = brandSlice.actions;

export default brandSlice.reducer;

export const selectBrands = (state: { brand: BrandState }) =>
  state.brand.listBrand;
