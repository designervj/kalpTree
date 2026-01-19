import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductModel } from "@/components/admin/product/type/ProductModel";

export type ProductState = {
  listProduct: ProductModel[];
  isProductLoading: boolean;
  hasFetched: boolean;
  lastFetchedWebsiteId?: string;
};

const initialState: ProductState = {
  listProduct: [],
  isProductLoading: false,
  hasFetched: false,
  lastFetchedWebsiteId: undefined,
};

export const fetchProducts = createAsyncThunk<
  ProductModel[],
  { websiteId: string },
  { state: { product: ProductState }; rejectValue: string }
>(
  "product/fetchProducts",
  async ({ websiteId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/product?websiteId=${websiteId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data?.items || [];
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Network error",
      );
    }
  },
  {
    condition: ({ websiteId }, { getState }) => {
      try {
        const state = getState() as { product: ProductState };
        // Prevent if already loading
        if (state.product.isProductLoading) {
          return false;
        }
        // Prevent if already fetched for this websiteId
        if (
          state.product.hasFetched &&
          state.product.lastFetchedWebsiteId === websiteId
        ) {
          return false;
        }
        return true;
      } catch {
        return true;
      }
    },
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<ProductModel[]>) {
      state.listProduct = action.payload;
    },
    addProduct(state, action: PayloadAction<ProductModel>) {
      state.listProduct.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<ProductModel>) {
      const updated = action.payload;
      const idx = state.listProduct.findIndex((c) => {
        if (!c) return false;
        if ((c as any)._id && (updated as any)._id)
          return String((c as any)._id) === String((updated as any)._id);
        if (c.id && updated.id) return String(c.id) === String(updated.id);
        return c.name === updated.name;
      });
      if (idx !== -1) {
        state.listProduct[idx] = {
          ...state.listProduct[idx],
          ...updated,
        };
      }
    },
    removeProduct(state, action: PayloadAction<string | number | undefined>) {
      const id = action.payload;
      state.listProduct = state.listProduct.filter((c) => {
        if (!c) return false;
        if ((c as any)._id && id) return String((c as any)._id) !== String(id);
        if (c.id && id) return String(c.id) !== String(id);
        return c.name !== String(id);
      });
    },
    clearProducts(state) {
      state.listProduct = [];
      state.isProductLoading = false;
      state.hasFetched = false;
      state.lastFetchedWebsiteId = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isProductLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log("====>>",action.payload)
        state.listProduct = action.payload;
        state.hasFetched = true;
        state.isProductLoading = false;
        state.lastFetchedWebsiteId = action.meta.arg.websiteId;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isProductLoading = false;
        // Still mark as fetched and store websiteId to prevent infinite retries
        state.hasFetched = true;
        state.lastFetchedWebsiteId = action.meta.arg.websiteId;
      });
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  clearProducts,
} = productSlice.actions;

export default productSlice.reducer;

export const selectProducts = (state: { product: ProductState }) =>
  state.product.listProduct;
