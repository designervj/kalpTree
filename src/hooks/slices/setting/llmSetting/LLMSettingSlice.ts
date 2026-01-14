import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LLMModel } from "@/components/admin/settings/integration/llm/type/LLMModel";

export type LLMSettingState = {
  listLLMSettings: LLMModel[];
  currentLLMSetting:LLMModel;
  isLLMSettingLoading: boolean;
  hasFetched: boolean;
};

const initialState: LLMSettingState = {
  listLLMSettings: [],
  currentLLMSetting:{},
  isLLMSettingLoading: false,
  hasFetched: false,

};

export const fetchLLMSettings = createAsyncThunk<
  LLMModel[],
 {tenantId:string},
  { state: { llmSetting: LLMSettingState }; rejectValue: string }
>(
  "llmSetting/fetchLLMSettings",
  async ({tenantId}, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/llmSetting?tenantId=${tenantId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log("LLM settings data", data);
      return data?.data || [];
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
        const state = getState() as { llmSetting: LLMSettingState };
        return !state.llmSetting.isLLMSettingLoading;
      } catch {
        return true;
      }
    },
  }
);

export const fetchLLMSettingByWebsiteId = createAsyncThunk<
  LLMModel | null,
  { websiteId: string },
  { rejectValue: string }
>(
  "llmSetting/fetchLLMSettingByWebsiteId",
  async ({ websiteId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/llmSetting?websiteId=${websiteId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log("LLM setting by websiteId", data);
      // Return the first active LLM setting or the first one in the list
      const settings = data?.data || [];
      const activeSetting = settings.find((s: LLMModel) => s.isActive);
      return activeSetting || settings[0] || null;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Network error"
      );
    }
  }
);

export const createLLMSetting = createAsyncThunk<
  LLMModel,
  { name: string; secreteKey: string },
  { rejectValue: string }
>(
  "llmSetting/createLLMSetting",
  async (llmData, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/llmSetting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(llmData),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data?.data;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Network error"
      );
    }
  }
);

export const updateLLMSetting = createAsyncThunk<
  LLMModel,
  { _id: string; name?: string; secreteKey?: string },
  { rejectValue: string }
>(
  "llmSetting/updateLLMSetting",
  async (llmData, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/llmSetting`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(llmData),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data?.data;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Network error"
      );
    }
  }
);

export const deleteLLMSetting = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "llmSetting/deleteLLMSetting",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/llmSetting?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      return id;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Network error"
      );
    }
  }
);

const llmSettingSlice = createSlice({
  name: "llmSetting",
  initialState,
  reducers: {
    setLLMSettings(state, action: PayloadAction<LLMModel[]>) {
      state.listLLMSettings = action.payload;
    },
    addLLMSetting(state, action: PayloadAction<LLMModel>) {
      state.listLLMSettings.push(action.payload);
    },
    updateLLMSettingLocal(state, action: PayloadAction<LLMModel>) {
      const updated = action.payload;
      const idx = state.listLLMSettings.findIndex((llm) => {
        if (!llm) return false;
        if (llm._id && updated._id) return String(llm._id) === String(updated._id);
        return llm.name === updated.name;
      });
      if (idx !== -1) {
        state.listLLMSettings[idx] = {
          ...state.listLLMSettings[idx],
          ...updated,
        };
      }
    },
    setCurrentLLMSetting(state,action){
      state.currentLLMSetting= action.payload
    },
    removeLLMSetting(state, action: PayloadAction<string | undefined>) {
      const id = action.payload;
      state.listLLMSettings = state.listLLMSettings.filter((llm) => {
        if (!llm) return false;
        if (llm._id && id) return String(llm._id) !== String(id);
        return llm.name !== String(id);
      });
    },
    clearLLMSettings(state) {
      state.listLLMSettings = [];
      state.isLLMSettingLoading = false;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch LLM Settings
      .addCase(fetchLLMSettings.pending, (state) => {
        state.isLLMSettingLoading = true;
      })
      .addCase(
        fetchLLMSettings.fulfilled,
        (state, action: PayloadAction<LLMModel[]>) => {
          state.listLLMSettings = action.payload;
          state.isLLMSettingLoading = false;
          state.hasFetched = true;
        }
      )
      .addCase(fetchLLMSettings.rejected, (state) => {
        state.isLLMSettingLoading = false;
      })
      // Fetch LLM Setting by Website ID
      .addCase(fetchLLMSettingByWebsiteId.pending, (state) => {
        state.isLLMSettingLoading = true;
      })
      .addCase(
        fetchLLMSettingByWebsiteId.fulfilled,
        (state, action: PayloadAction<LLMModel | null>) => {
          if (action.payload) {
            state.currentLLMSetting = action.payload;
          }
          state.isLLMSettingLoading = false;
        }
      )
      .addCase(fetchLLMSettingByWebsiteId.rejected, (state) => {
        state.isLLMSettingLoading = false;
      })
      // Create LLM Setting
      .addCase(createLLMSetting.pending, (state) => {
        state.isLLMSettingLoading = true;
      })
      .addCase(
        createLLMSetting.fulfilled,
        (state, action: PayloadAction<LLMModel>) => {
          state.listLLMSettings.push(action.payload);
          state.isLLMSettingLoading = false;
        }
      )
      .addCase(createLLMSetting.rejected, (state) => {
        state.isLLMSettingLoading = false;
      })
      // Update LLM Setting
      .addCase(updateLLMSetting.pending, (state) => {
        state.isLLMSettingLoading = true;
      })
      .addCase(
        updateLLMSetting.fulfilled,
        (state, action: PayloadAction<LLMModel>) => {
          const updated = action.payload;
          const idx = state.listLLMSettings.findIndex((llm) => {
            if (!llm) return false;
            if (llm._id && updated._id) return String(llm._id) === String(updated._id);
            return false;
          });
          if (idx !== -1) {
            state.listLLMSettings[idx] = {
              ...state.listLLMSettings[idx],
              ...updated,
            };
          }
          state.isLLMSettingLoading = false;
        }
      )
      .addCase(updateLLMSetting.rejected, (state) => {
        state.isLLMSettingLoading = false;
      })
      // Delete LLM Setting
      .addCase(deleteLLMSetting.pending, (state) => {
        state.isLLMSettingLoading = true;
      })
      .addCase(
        deleteLLMSetting.fulfilled,
        (state, action: PayloadAction<string>) => {
          const id = action.payload;
          state.listLLMSettings = state.listLLMSettings.filter((llm) => {
            if (!llm) return false;
            if (llm._id) return String(llm._id) !== String(id);
            return true;
          });
          state.isLLMSettingLoading = false;
        }
      )
      .addCase(deleteLLMSetting.rejected, (state) => {
        state.isLLMSettingLoading = false;
      });
  },
});

export const {
  setLLMSettings,
  addLLMSetting,
  updateLLMSettingLocal,
  removeLLMSetting,
  clearLLMSettings,
  setCurrentLLMSetting,
} = llmSettingSlice.actions;

export default llmSettingSlice.reducer;

export const selectLLMSettings = (state: { llmSetting: LLMSettingState }) =>
  state.llmSetting.listLLMSettings;

export const selectIsLLMSettingLoading = (state: { llmSetting: LLMSettingState }) =>
  state.llmSetting.isLLMSettingLoading;
