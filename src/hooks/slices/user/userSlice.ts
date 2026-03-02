"use client";

import { IUser } from "@/models/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RolePermissionModel, updateRolePermission } from "../RolePermissions/rolePermissionSlice";
import { createBusinessUser, createCustomer, deleteBusinessUser, getAgencyUser, getAllUser, getBusinessUser, updateBusinessUser } from "./UserThunk";

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
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
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
    clearAllUser: (state) => {
      state.alluser = [];
      state.hasFetchedAllUsers = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUser.fulfilled, (state, action: PayloadAction<IUser[]>) => {
        state.isLoading = false;
        state.hasFetchedAllUsers = true;
        state.alluser = action.payload;
      })
      .addCase(getAllUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCustomer.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.alluser.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateRolePermission.fulfilled, (state, action: PayloadAction<RolePermissionModel>) => {
        const updatedRole = action.payload;
        state.alluser = state.alluser.map((user) =>
          user._id === updatedRole._id ? { ...user, permissions: updatedRole.permissions } : user
        );
      })
      .addCase(getBusinessUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBusinessUser.fulfilled, (state, action: PayloadAction<IUser[]>) => {
        state.isLoading = false;
        state.hasFetchedAllUsers = true;
        state.alluser = action.payload;
      })
      .addCase(getBusinessUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAgencyUser.fulfilled, (state, action: PayloadAction<IUser[]>) => {
        state.isLoading = false;
        state.hasFetchedAllUsers = true;
        state.alluser = action.payload;
      })
      .addCase(getAgencyUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createBusinessUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.alluser.unshift(action.payload);
      })
      .addCase(updateBusinessUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.alluser = state.alluser.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
        state.currentUser = null;
      })
      .addCase(deleteBusinessUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.alluser = state.alluser.filter((user) => user._id !== action.payload._id);
      });
  },
});

export const setUser = userSlice.actions.setUser;
export const clearUser = userSlice.actions.clearUser;
export const updateUser = userSlice.actions.updateUser;
export const updateIsSecondDashBoard = userSlice.actions.updateIsSecondDashBoard;
export const setCurrentUser = userSlice.actions.setCurrentUser;
export const clearAllUser = userSlice.actions.clearAllUser;

export default userSlice.reducer;
