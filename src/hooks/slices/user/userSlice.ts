

import { IUser } from "@/models/user";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RolePermissionModel, updateRolePermission } from "../RolePermissions/rolePermissionSlice";

export const getAllUser = createAsyncThunk<IUser[]>(
  "user/getAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/getAllUsers");
      const data = await response.json();
      // API returns { users: IUser[] } with superadmin filtered out
      return data.users;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCustomer = createAsyncThunk<
  IUser,
  Partial<IUser>,
  { rejectValue: any }
>("user/createCustomer", async (userData, { rejectWithValue }) => {
  try {
    const payload = {
      ...userData,
      password: userData.passwordHash,
    };
    delete payload.passwordHash;
    const response = await axios.post("/api/admin/customer", payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updatePassword = createAsyncThunk<
  IUser,
  { email: string; password: string },
  { rejectValue: any }
>("user/updatePassword", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/user/createwithemail`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email }),
    });
    return response.json();
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

interface UserState {
  user: IUser | null;
  isSecondDashBoard: boolean;
  alluser: IUser[];
  isLoading: boolean;
  hasFetched: boolean;
  hasFetchedAllUsers: boolean;
  websiteCount: number;
  currentUser: IUser | null;
}

const initialState: UserState = {
  user: null,
  isSecondDashBoard: false,
  alluser: [],
  isLoading: false,
  hasFetched: false,
  hasFetchedAllUsers: false,
  websiteCount: 0,
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    updateUser(state, action: PayloadAction<Partial<UserState["user"]>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateIsSecondDashBoard: (state, action) => {
      state.isSecondDashBoard = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<IUser | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getAllUser.fulfilled,
        (state, action: PayloadAction<IUser[]>) => {
          state.isLoading = false;
          state.hasFetchedAllUsers = true;
          state.alluser = action.payload;
        }
      )
      .addCase(getAllUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        createCustomer.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.isLoading = false;
          // Optionally add the new user to alluser
          state.alluser.unshift(action.payload);
        }
      )
      .addCase(createCustomer.rejected, (state) => {
        state.isLoading = false;
      })

      // when permission update
      .addCase(updateRolePermission.fulfilled, (state, action: PayloadAction<RolePermissionModel>) => {
        const updatedRole = action.payload;
        state.alluser = state.alluser.map((user) =>
          user._id === updatedRole._id ? { ...user, permissions: updatedRole.permissions } : user
        );
      })
  },
});

export const { setUser, clearUser, updateUser, updateIsSecondDashBoard, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
