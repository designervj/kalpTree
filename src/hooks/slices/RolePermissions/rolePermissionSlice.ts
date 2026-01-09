import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ObjectId } from "mongodb";

export interface RolePermissionModel {
  id?: ObjectId | string;
  _id?: string;
  code?: string;
  name?: string;
  permissions: string[];
  canCreateRole?: string[];
  type: string;
  canMultipleTenants: boolean;
}

export interface RolePermissionState {
  rolesPermissions: RolePermissionModel[];
  hasFetched: boolean;
  current?: RolePermissionModel;
  loading: boolean;
  error?: string;
}

const initialState: RolePermissionState = {
  rolesPermissions: [],
  loading: false,
  hasFetched: false,
};

export const fetchRolePermissions = createAsyncThunk<RolePermissionModel[]>(
  "rolePermission/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/roles");
      console.log(response.data)
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
    const response = await axios.post("/api/role-permissions", data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateRolePermission = createAsyncThunk<
  RolePermissionModel,
  Partial<RolePermissionModel>
>("rolePermission/update", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.put("/api/role-permissions", data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteRolePermission = createAsyncThunk<{ id: string }, string>(
  "rolePermission/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/role-permissions?id=${id}`);
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
    },
    updateRolePermissions: (state, action) => {
      state.rolesPermissions = action.payload;
      state.hasFetched = true;
    },
    addRoles: (state, action) => {
      state.rolesPermissions.push(action.payload);
    },
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
      .addCase(updateRolePermission.fulfilled, (state, action) => {
        state.rolesPermissions = state.rolesPermissions.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(deleteRolePermission.fulfilled, (state, action) => {
        state.rolesPermissions = state.rolesPermissions.filter(
          (item) => item.id !== action.payload.id
        );
      });
  },
});

export const { setCurrentRolePermission, addRoles, updateRolePermissions } =
  rolePermissionSlice.actions;
export default rolePermissionSlice.reducer;
