import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LLMModel } from "@/components/admin/settings/integration/llm/type/LLMModel";
import { createLLMSetting, deleteLLMSetting, fetchLLMSettingById, fetchLLMSettingByWebsiteId, fetchLLMSettings, updateLLMSetting } from "./LLMSettingThunk";

export type LLMSettingState = {
  listLLMSettings: LLMModel[];
  currentLLMSetting: LLMModel;
  isLLMSettingLoading: boolean;
  hasFetched: boolean;
};

const initialState: LLMSettingState = {
  listLLMSettings: [],
  currentLLMSetting: {},
  isLLMSettingLoading: false,
  hasFetched: false,

};


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
    setCurrentLLMSetting(state, action) {
      state.currentLLMSetting = action.payload
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
      // Fetch LLM Setting by ID
      .addCase(fetchLLMSettingById.pending, (state) => {
        state.isLLMSettingLoading = true;
      })
      .addCase(
        fetchLLMSettingById.fulfilled,
        (state, action: PayloadAction<LLMModel>) => {
          state.currentLLMSetting = action.payload;
          state.isLLMSettingLoading = false;
        }
      )
      .addCase(fetchLLMSettingById.rejected, (state) => {
        state.isLLMSettingLoading = false;
      })
      // Create LLM Setting
      .addCase(createLLMSetting.pending, (state) => {
        state.isLLMSettingLoading = true;
      })
      .addCase(
        createLLMSetting.fulfilled,
        (state, action: PayloadAction<{ data: LLMModel, success: boolean }>) => {
          const { data } = action.payload;
          state.listLLMSettings.push(data);
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
