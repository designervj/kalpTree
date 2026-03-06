import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaterialAttributes } from "@/components/admin/attribute/types/attributeModel";

export type AttributeState = {
  listAttribute: MaterialAttributes[];
  isAttributeLoading: boolean;
  hasFetched: boolean;
};

const initialState: AttributeState = {
  listAttribute: [],
  isAttributeLoading: false,
  hasFetched: false,
};

export const fetchAttributes = createAsyncThunk<
  MaterialAttributes[],
  { websiteId: string },
  { state: { attribute: AttributeState }; rejectValue: string }
>(
  "attribute/fetchAttributes",
  async ({ websiteId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/attribute?websiteId=${websiteId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      // API returns { items }

      return data?.items || [];
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Network error"
      );
    }
  },
  {
    // prevent duplicate concurrent fetches
    condition: (_, { getState }) => {
      try {
        const state = getState() as { attribute: AttributeState };
        return !state.attribute.isAttributeLoading;
      } catch {
        return true;
      }
    },
  }
);

const attributeSlice = createSlice({
  name: "attribute",
  initialState,
  reducers: {
    setAttributes(state, action: PayloadAction<MaterialAttributes[]>) {
      state.listAttribute = action.payload;
    },
    addAttribute(state, action: PayloadAction<MaterialAttributes>) {
      state.listAttribute.push(action.payload);
    },
    updateAttribute(state, action: PayloadAction<MaterialAttributes>) {
      const updated = action.payload;
      const idx = state.listAttribute.findIndex((a) => {
        if (!a) return false;
        // prefer _id if present, otherwise fall back to id or name
        if (a._id && updated._id) return String(a._id) === String(updated._id);
        if (a.id && updated.id) return String(a.id) === String(updated.id);
        return a.name === updated.name;
      });
      if (idx !== -1) {
        state.listAttribute[idx] = {
          ...state.listAttribute[idx],
          ...updated,
        };
      }
    },
    removeAttribute(state, action: PayloadAction<string | number | undefined>) {
      const id = action.payload;
      state.listAttribute = state.listAttribute.filter((a) => {
        if (!a) return false;
        if (a._id && id) return String(a._id) !== String(id);
        if (a.id && id) return String(a.id) !== String(id);
        return a.name !== String(id);
      });
    },
    clearAttributes(state) {
      state.listAttribute = [];
      state.hasFetched = false;
      state.isAttributeLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttributes.pending, (state) => {
        state.isAttributeLoading = true;
      })
      .addCase(
        fetchAttributes.fulfilled,
        (state, action: PayloadAction<MaterialAttributes[]>) => {
          state.listAttribute = action.payload;
          state.hasFetched = true;
          state.isAttributeLoading = false;
        }
      )
      .addCase(fetchAttributes.rejected, (state) => {
        state.isAttributeLoading = false;
      });
  },
});

export const {
  setAttributes,
  addAttribute,
  updateAttribute,
  removeAttribute,
  clearAttributes,
} = attributeSlice.actions;

export default attributeSlice.reducer;

export const selectAttributes = (state: { attribute: AttributeState }) =>
  state.attribute.listAttribute;
