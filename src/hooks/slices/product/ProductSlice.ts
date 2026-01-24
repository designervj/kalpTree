import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductModel } from "@/components/admin/product/type/ProductModel";
import { toast } from "sonner";

export type ProductState = {
  listProduct: ProductModel[];
  isProductLoading: boolean;
  hasFetched: boolean;
  lastFetchedWebsiteId?: string;
  cart: [];
  isCartLoading: boolean;
};

const initialState: ProductState = {
  listProduct: [],
  isProductLoading: false,
  hasFetched: false,
  lastFetchedWebsiteId: undefined,
  cart: [],
  isCartLoading: false,
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

export const fetchCart = createAsyncThunk(
  "product/fetchCart",
  async (
    { websiteId, userId }: { websiteId: string; userId?: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetch(
        `/api/admin/cart?websiteId=${websiteId}&userId=${userId}`,
      );

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

export const updateCart = createAsyncThunk(
  "product/fetchCart",
  async (
    {
      websiteId,
      userId,
      cartData,
    }: { websiteId: string; userId?: string; cartData: any },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetch(
        `/api/admin/cart?websiteId=${websiteId}&userId=${userId}`,
        {
          method: "POST",
          body: JSON.stringify(cartData),
        },
      );

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
        return c.title === updated.title;
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
        return c.title !== String(id);
      });
    },
    clearProducts(state) {
      state.listProduct = [];
      state.isProductLoading = false;
      state.hasFetched = false;
      state.lastFetchedWebsiteId = undefined;
    },
    addProductInCart(state, action) {
      const { productId, variantId } = action.payload;

      const findIndex = state.cart.findIndex(
        (item) => item.productId == productId && item.variantId == variantId,
      );

      if (findIndex > -1) {
        const newQuantity = Number(state.cart[findIndex].quantity) + 1;
        const productVariant = state.listProduct.find(
          (d) => d._id == productId,
        );
        const variant = productVariant?.variants?.find(
          (d) => d._id == variantId,
        );

        if (newQuantity > Number(variant.stock)) {
          toast.error("Item out of Stock");
        } else {
          state.cart[findIndex].quantity = newQuantity;
        }
      } else {
        const newCart = {
          productId,
          variantId,
          quantity: 1,
        };
        state.cart.push(newCart);
      }
    },
    removeProductInCart(state, action) {
      const index = action.payload;
      state.cart = state.cart.filter((d, idx) => idx !== index);
    },

    updateProductQtyInCart(state, action) {
      const { index, delta } = action.payload;
      const newQuantity = Number(state.cart[index].quantity) + delta;
      const mainVariant = state.cart[index];
      const productVariant = state.listProduct.find(
        (d) => d._id == mainVariant.productId,
      );
      const variant = productVariant?.variants?.find(
        (d) => d._id == mainVariant.variantId,
      );
      if (newQuantity > Number(variant.stock)) {
        toast.error("Item out of Stock");
      } else if (newQuantity < 1) {
        state.cart = state.cart.filter((d, idx) => idx != index);
      } else {
        state.cart[index].quantity = newQuantity;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isProductLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
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
      })
      .addCase(fetchCart.pending, (state) => {
        state.isCartLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.isCartLoading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isCartLoading = false;
      });
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  clearProducts,
  addProductInCart,
  removeProductInCart,
  updateProductQtyInCart,
} = productSlice.actions;

export default productSlice.reducer;

export const selectProducts = (state: { product: ProductState }) =>
  state.product.listProduct;
