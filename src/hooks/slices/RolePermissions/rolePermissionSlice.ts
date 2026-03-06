import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { ObjectId } from "mongodb";

export interface RolePermissionModel {
  id?: ObjectId | string;
  _id?: string | string;
  code?: string;
  name?: string;
  permissions: string[];
  canCreateRole?: string[];
  type?: string;
  canMultipleTenants?: boolean;
  tenantId?: string;
}

export interface RolePermissionState {
  rolesPermissions: RolePermissionModel[];
  hasFetched: boolean;
  current?: RolePermissionModel | null;
  loading: boolean;
  error?: string;
  isUserRole?: boolean;
}

const initialState: RolePermissionState = {
  rolesPermissions: [],
  loading: false,
  hasFetched: false,
  current: null,
  isUserRole: false
};

export const fetchRolePermissions = createAsyncThunk<RolePermissionModel[], string | null | undefined>(
  "rolePermission/fetchAll",
  async (businessid, { rejectWithValue }) => {
    try {
      const url = `/api/roles?businessid=${businessid}`;
      const response = await axios.get(url);
      return response.data.items;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createRolePermission = createAsyncThunk<
  RolePermissionModel,
  Partial<RolePermissionModel>
>("rolePermission/create", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    console.log("responseData", responseData?.items)
    return responseData
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateRolePermission = createAsyncThunk<
  RolePermissionModel,
  Partial<RolePermissionModel>
>("rolePermission/update", async (data, { rejectWithValue }) => {
  try {

    const response = await fetch("/api/roles", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    return responseData?.updated;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteRolePermission = createAsyncThunk<{ id: string }, string>(
  "rolePermission/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/role/${id}`);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const rolePermissionSlice = createSlice({
  name: "rolePermission",
  initialState,
  reducers: {
    setCurrentRolePermission(
      state,
      action: PayloadAction<RolePermissionModel | undefined>
    ) {
      state.current = action.payload;
      // state.currentRolePermission = action.payload;
    },

    setIsUserRole(state, action: PayloadAction<boolean>) {
      state.isUserRole = action.payload;
    },
    updateRolePermissions: (state, action) => {
      state.rolesPermissions = action.payload;
      state.hasFetched = true;
    },
    addRoles: (state, action) => {
      state.rolesPermissions.push(action.payload);
    },
    clearCurrentRolePermission: (state) => {
      state.current = null;
    },
    resetFetchAllRolePermission: (state) => {
      state.rolesPermissions = [];
      state.hasFetched = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRolePermissions.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchRolePermissions.fulfilled, (state, action) => {
        state.rolesPermissions = action.payload;
        state.loading = false;
        state.hasFetched = true;
      })
      .addCase(fetchRolePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRolePermission.fulfilled, (state, action) => {
        state.rolesPermissions.push(action.payload);
      })
      .addCase(updateRolePermission.fulfilled, (state, action: PayloadAction<any>) => {
        const updatedRole = action.payload.updated || action.payload;
        state.rolesPermissions = state.rolesPermissions.map((item) =>
          item._id === updatedRole._id ? updatedRole : item
        );
        state.current = null
      })
      .addCase(deleteRolePermission.fulfilled, (state, action) => {
        state.rolesPermissions = state.rolesPermissions.filter(
          (item) => item._id !== action.payload.id && item.id !== action.payload.id
        );
      });
  },
});

export const { setCurrentRolePermission,
  addRoles, updateRolePermissions,
  clearCurrentRolePermission, resetFetchAllRolePermission,
  setIsUserRole } =
  rolePermissionSlice.actions;
export default rolePermissionSlice.reducer;
