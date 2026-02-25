

import { IUser } from "@/models/user";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RolePermissionModel, updateRolePermission } from "../RolePermissions/rolePermissionSlice";
import { createBusinessUser, createCustomer, deleteBusinessUser, getAllUser, getBusinessUser, updateBusinessUser } from "./UserThunk";


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

      // get businessd Users
      .addCase(getBusinessUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getBusinessUser.fulfilled,
        (state, action: PayloadAction<IUser[]>) => {
          state.isLoading = false;
          state.hasFetchedAllUsers = true;
          state.alluser = action.payload;
        }
      )
      .addCase(getBusinessUser.rejected, (state) => {
        state.isLoading = false;
      })

      // create business user
      .addCase(createBusinessUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        createBusinessUser.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.isLoading = false;
          // Optionally add the new user to alluser
          state.alluser.unshift(action.payload);
        }
      )
      .addCase(createBusinessUser.rejected, (state) => {
        state.isLoading = false;
      })

      // update business user
      .addCase(updateBusinessUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        updateBusinessUser.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.isLoading = false;
          // Optionally add the new user to alluser
          state.alluser = state.alluser.map((user) =>
            user._id === action.payload._id ? action.payload : user
          );
        }
      )
      .addCase(updateBusinessUser.rejected, (state) => {
        state.isLoading = false;
      })

      // delete business user
      .addCase(deleteBusinessUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        deleteBusinessUser.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.isLoading = false;
          // Optionally add the new user to alluser
          state.alluser = state.alluser.filter((user) => user._id !== action.payload._id);
        }
      )
      .addCase(deleteBusinessUser.rejected, (state) => {
        state.isLoading = false;
      })
  },
});

export const { 
  setUser,  
  clearUser, 
  updateUser, 
  updateIsSecondDashBoard, 
  setCurrentUser,
  clearAllUser 
} = userSlice.actions;
export default userSlice.reducer;
