import { AttributeSet } from "@/components/admin/attributessets/forms/AttributeSetsForm";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AttributeSetsState = {
  listAttributeSets: AttributeSet[];
  isAttributeSetsLoading: boolean;
  hasFetched: boolean;
};

const initialState: AttributeSetsState = {
  listAttributeSets: [],
  isAttributeSetsLoading: false,
  hasFetched: false,
};

export const fetchAttributeSets = createAsyncThunk<
  AttributeSet[],
  { websiteId: string },
  { state: { attributeSets: AttributeSetsState }; rejectValue: string }
>(
  "attributeSets/fetchAttributeSets",
  async ({ websiteId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/attributessets?websiteId=${websiteId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      // API returns { items }
      console.log("attribute sets data", data);
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
        const state = getState() as { attributeSets: AttributeSetsState };
        return !state.attributeSets.isAttributeSetsLoading;
      } catch {
        return true;
      }
    },
  }
);

const attributeSetsSlice = createSlice({
  name: "attributeSets",
  initialState,
  reducers: {
    setAttributeSets(state, action: PayloadAction<AttributeSet[]>) {
      state.listAttributeSets = action.payload;
    },
    addAttributeSet(state, action: PayloadAction<AttributeSet>) {
      state.listAttributeSets.push(action.payload);
    },
    updateAttributeSet(state, action: PayloadAction<AttributeSet>) {
      const updated = action.payload;
      const idx = state.listAttributeSets.findIndex((a) => {
        if (!a) return false;
        // prefer _id if present, otherwise fall back to id
        if (a._id && updated._id) return String(a._id) === String(updated._id);
        if (a.id && updated.id) return String(a.id) === String(updated.id);
        return false;
      });
      if (idx !== -1) {
        state.listAttributeSets[idx] = {
          ...state.listAttributeSets[idx],
          ...updated,
        };
      }
    },
    removeAttributeSet(state, action: PayloadAction<string | number | undefined>) {
      const id = action.payload;
      state.listAttributeSets = state.listAttributeSets.filter((a) => {
        if (!a) return false;
        if (a._id && id) return String(a._id) !== String(id);
        if (a.id && id) return String(a.id) !== String(id);
        return true;
      });
    },
    clearAttributeSets(state) {
      state.listAttributeSets = [];
      state.isAttributeSetsLoading = false;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttributeSets.pending, (state) => {
        state.isAttributeSetsLoading = true;
      })
      .addCase(
        fetchAttributeSets.fulfilled,
        (state, action: PayloadAction<AttributeSet[]>) => {
          state.listAttributeSets = action.payload;
          state.hasFetched = true;
          state.isAttributeSetsLoading = false;
        }
      )
      .addCase(fetchAttributeSets.rejected, (state) => {
        state.isAttributeSetsLoading = false;
      });
  },
});

export const {
  setAttributeSets,
  addAttributeSet,
  updateAttributeSet,
  removeAttributeSet,
  clearAttributeSets,
} = attributeSetsSlice.actions;

export default attributeSetsSlice.reducer;

export const selectAttributeSets = (state: { attributeSets: AttributeSetsState }) =>
  state.attributeSets.listAttributeSets;