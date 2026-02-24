// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { MaterialCategory } from "@/components/admin/category/types/CategoryModel";

// export type ProductType = {
//   name: string;
//   _id?: string;
//   slug: string;
// };

// export type CategoryState = {
//   listCategory: MaterialCategory[];
//   isCategoryLoading: boolean;
//   hasFetched: boolean;
//   listProductType: ProductType[];
//   isProductTypeLoading: boolean;
//   hasFetchedProductType: boolean;
// };

// const initialState: CategoryState = {
//   listCategory: [],
//   isCategoryLoading: false,
//   hasFetched: false,
//   listProductType: [],
//   isProductTypeLoading: false,
//   hasFetchedProductType: false,
// };
// export const fetchCategories = createAsyncThunk<
//   MaterialCategory[],
//   { websiteId: string },
//   { state: { category: CategoryState }; rejectValue: string }
// >(
//   "category/fetchCategories",
//   async ({ websiteId }, { rejectWithValue }) => {
//     try {
//       const res = await fetch(`/api/admin/category?websiteId=${websiteId}`);
//       if (!res.ok) {
//         const body = await res.json().catch(() => ({}));
//         return rejectWithValue(body?.error || `HTTP ${res.status}`);
//       }
//       const data = await res.json();
//       // API returns { items }
//       console.log("daat", data);
//       return data?.items || [];
//     } catch (error: unknown) {
//       return rejectWithValue(
//         error instanceof Error ? error.message : "Network error",
//       );
//     }
//   },
//   {
//     // prevent duplicate concurrent fetches
//     condition: (_, { getState }) => {
//       try {
//         const state = getState() as { category: CategoryState };
//         return !state.category.isCategoryLoading;
//       } catch {
//         return true;
//       }
//     },
//   },
// );

// export const fetchProductType = createAsyncThunk(
//   "category/fetchProductType",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await fetch(`/api/admin/producttype`);
//       if (!res.ok) {
//         const body = await res.json().catch(() => ({}));
//         return rejectWithValue(body?.error || `HTTP ${res.status}`);
//       }
//       const data = await res.json();
//       return data?.items || [];
//     } catch (error: unknown) {
//       return rejectWithValue(
//         error instanceof Error ? error.message : "Network error",
//       );
//     }
//   },
// );

// const categorySlice = createSlice({
//   name: "category",
//   initialState,
//   reducers: {
//     setCategories(state, action: PayloadAction<MaterialCategory[]>) {
//       state.listCategory = action.payload;
//     },
//     addCategory(state, action: PayloadAction<MaterialCategory>) {
//       state.listCategory.push(action.payload);
//     },
//     updateCategory(state, action: PayloadAction<MaterialCategory>) {
//       const updated = action.payload;
//       const idx = state.listCategory.findIndex((c) => {
//         if (!c) return false;
//         // prefer _id if present, otherwise fall back to id or name
//         if (c._id && updated._id) return String(c._id) === String(updated._id);
//         if (c.id && updated.id) return String(c.id) === String(updated.id);
//         return c.name === updated.name;
//       });
//       if (idx !== -1) {
//         state.listCategory[idx] = {
//           ...state.listCategory[idx],
//           ...updated,
//         };
//       }
//     },
//     removeCategory(state, action: PayloadAction<string | number | undefined>) {
//       const id = action.payload;
//       state.listCategory = state.listCategory.filter((c) => {
//         if (!c) return false;
//         if (c._id && id) return String(c._id) !== String(id);
//         if (c.id && id) return String(c.id) !== String(id);
//         return c.name !== String(id);
//       });
//     },
//     clearCategories(state) {
//       state.listCategory = [];
//       state.isCategoryLoading = false;
//       state.hasFetched = false;
//     },
//     // Add these to categorySlice reducers:
//     addProductType(state, action: PayloadAction<ProductType>) {
//       state.listProductType.push(action.payload);
//     },
//     updateProductType(state, action: PayloadAction<ProductType>) {
//       const updated = action.payload;
//       const idx = state.listProductType.findIndex(
//         (p) => p._id === updated._id || p.name === updated.name,
//       );
//       if (idx !== -1) {
//         state.listProductType[idx] = {
//           ...state.listProductType[idx],
//           ...updated,
//         };
//       }
//     },
//     removeProductType(state, action: PayloadAction<string>) {
//       const id = action.payload;
//       state.listProductType = state.listProductType.filter(
//         (p) => p._id !== id && p.name !== id,
//       );
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCategories.pending, (state) => {
//         state.isCategoryLoading = true;
//       })
//       .addCase(
//         fetchCategories.fulfilled,
//         (state, action: PayloadAction<MaterialCategory[]>) => {
//           state.listCategory = action.payload;
//           state.hasFetched = true;
//         },
//       )
//       .addCase(fetchCategories.rejected, (state) => {
//         state.isCategoryLoading = false;
//       })
//       .addCase(fetchProductType.pending, (state) => {
//         state.isProductTypeLoading = true;
//       })
//       .addCase(
//         fetchProductType.fulfilled,
//         (state, action: PayloadAction<ProductType[]>) => {
//           state.listProductType = action.payload;
//           state.hasFetchedProductType = true;
//         },
//       )
//       .addCase(fetchProductType.rejected, (state) => {
//         state.isProductTypeLoading = false;
//       });
//   },
// });

// export const {
//   setCategories,
//   addCategory,
//   updateCategory,
//   removeCategory,
//   clearCategories,
//   addProductType,
//   removeProductType,
//   updateProductType,
// } = categorySlice.actions;

// export default categorySlice.reducer;

// export const selectCategories = (state: { category: CategoryState }) =>
//   state.category.listCategory;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaterialCategory } from "@/components/admin/category/types/CategoryModel";

export type ProductType = {
  name: string;
  _id?: string;
  slug: string;
};

export type ProductTypeCategory = {
  _id?: string;
  name: string;
  slug: string;
  product_type: string; // ID of product type
  icon?: string;
  sort_order?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CategoryState = {
  listCategory: MaterialCategory[];
  isCategoryLoading: boolean;
  hasFetched: boolean;
  listProductType: ProductType[];
  isProductTypeLoading: boolean;
  hasFetchedProductType: boolean;
  listProductTypeCategory: ProductTypeCategory[];
  isProductTypeCategoryLoading: boolean;
  hasFetchedProductTypeCategory: boolean;
};

const initialState: CategoryState = {
  listCategory: [],
  isCategoryLoading: false,
  hasFetched: false,
  listProductType: [],
  isProductTypeLoading: false,
  hasFetchedProductType: false,
  listProductTypeCategory: [],
  isProductTypeCategoryLoading: false,
  hasFetchedProductTypeCategory: false,
};

export const fetchCategories = createAsyncThunk<
  MaterialCategory[],
  { tenantId: string },
  { state: { category: CategoryState }; rejectValue: string }
>(
  "category/fetchCategories",
  async ({ tenantId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/category?tenantId=${tenantId}`);
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
    condition: (_, { getState }) => {
      try {
        const state = getState() as { category: CategoryState };
        return !state.category.isCategoryLoading;
      } catch {
        return true;
      }
    },
  },
);

export const fetchProductType = createAsyncThunk(
  "category/fetchProductType",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/producttype`);
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
);

export const fetchProductTypeCategories = createAsyncThunk(
  "category/fetchProductTypeCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/producttypecategory`);
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
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<MaterialCategory[]>) {
      state.listCategory = action.payload;
    },
    addCategory(state, action: PayloadAction<MaterialCategory>) {
      state.listCategory.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<MaterialCategory>) {
      const updated = action.payload;
      const idx = state.listCategory.findIndex((c) => {
        if (!c) return false;
        if (c._id && updated._id) return String(c._id) === String(updated._id);
        if (c.id && updated.id) return String(c.id) === String(updated.id);
        return c.name === updated.name;
      });
      if (idx !== -1) {
        state.listCategory[idx] = {
          ...state.listCategory[idx],
          ...updated,
        };
      }
    },
    removeCategory(state, action: PayloadAction<string | number | undefined>) {
      const id = action.payload;
      state.listCategory = state.listCategory.filter((c) => {
        if (!c) return false;
        if (c._id && id) return String(c._id) !== String(id);
        if (c.id && id) return String(c.id) !== String(id);
        return c.name !== String(id);
      });
    },
    clearCategories(state) {
      state.listCategory = [];
      state.isCategoryLoading = false;
      state.hasFetched = false;
    },
    // Product Type reducers
    addProductType(state, action: PayloadAction<ProductType>) {
      state.listProductType.push(action.payload);
    },
    updateProductType(state, action: PayloadAction<ProductType>) {
      const updated = action.payload;
      const idx = state.listProductType.findIndex(
        (p) => p._id === updated._id || p.name === updated.name,
      );
      if (idx !== -1) {
        state.listProductType[idx] = {
          ...state.listProductType[idx],
          ...updated,
        };
      }
    },
    removeProductType(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.listProductType = state.listProductType.filter(
        (p) => p._id !== id && p.name !== id,
      );
    },
    // Product Type Category reducers
    addProductTypeCategory(state, action: PayloadAction<ProductTypeCategory>) {
      state.listProductTypeCategory.push(action.payload);
    },
    updateProductTypeCategory(
      state,
      action: PayloadAction<ProductTypeCategory>,
    ) {
      const updated = action.payload;
      const idx = state.listProductTypeCategory.findIndex(
        (p) => p._id === updated._id || p.name === updated.name,
      );
      if (idx !== -1) {
        state.listProductTypeCategory[idx] = {
          ...state.listProductTypeCategory[idx],
          ...updated,
        };
      }
    },
    removeProductTypeCategory(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.listProductTypeCategory = state.listProductTypeCategory.filter(
        (p) => p._id !== id,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isCategoryLoading = true;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<MaterialCategory[]>) => {
          state.listCategory = action.payload;
          state.hasFetched = true;
          state.isCategoryLoading = false;
        },
      )
      .addCase(fetchCategories.rejected, (state) => {
        state.isCategoryLoading = false;
      })
      .addCase(fetchProductType.pending, (state) => {
        state.isProductTypeLoading = true;
      })
      .addCase(
        fetchProductType.fulfilled,
        (state, action: PayloadAction<ProductType[]>) => {
          state.listProductType = action.payload;
          state.hasFetchedProductType = true;
          state.isProductTypeLoading = false;
        },
      )
      .addCase(fetchProductType.rejected, (state) => {
        state.isProductTypeLoading = false;
      })
      .addCase(fetchProductTypeCategories.pending, (state) => {
        state.isProductTypeCategoryLoading = true;
      })
      .addCase(
        fetchProductTypeCategories.fulfilled,
        (state, action: PayloadAction<ProductTypeCategory[]>) => {
          state.listProductTypeCategory = action.payload;
          state.hasFetchedProductTypeCategory = true;
          state.isProductTypeCategoryLoading = false;
        },
      )
      .addCase(fetchProductTypeCategories.rejected, (state) => {
        state.isProductTypeCategoryLoading = false;
      });
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  clearCategories,
  addProductType,
  removeProductType,
  updateProductType,
  addProductTypeCategory,
  updateProductTypeCategory,
  removeProductTypeCategory,
} = categorySlice.actions;

export default categorySlice.reducer;

export const selectCategories = (state: { category: CategoryState }) =>
  state.category.listCategory;
