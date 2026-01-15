import { LLMModel } from "@/components/admin/settings/integration/llm/type/LLMModel";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { LLMSettingState } from "./LLMSettingSlice";


export const fetchLLMSettings = createAsyncThunk<
  LLMModel[],
  { tenantId: string },
  { state: { llmSetting: LLMSettingState }; rejectValue: string }
>(
  "llmSetting/fetchLLMSettings",
  async ({ tenantId }, { rejectWithValue }) => {
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

export const fetchLLMSettingById = createAsyncThunk<
  LLMModel,
  { id: string },
  { rejectValue: string }
>(
  "llmSetting/fetchLLMSettingById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/llmSetting/${id}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log("LLM setting by ID", data);
      return data?.data;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Network error"
      );
    }
  }
);


export const createLLMSetting = createAsyncThunk<
  { data: LLMModel; success: boolean },
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
      return data;
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
      const res = await fetch(`/api/admin/llmSetting`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
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
