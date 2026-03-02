import { IUser } from "@/models/user";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

/// get business all users for a specific tenant
export const getBusinessUser = createAsyncThunk<IUser[], string>(
  "user/getBusinessUser",
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/business/users?tenantId=${tenantId}`);
      const data = await response.json();
      // API returns { users: IUser[] }

      return data.users;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/// get agency all users for a specific tenant
export const getAgencyUser = createAsyncThunk<IUser[], string>(
  "user/getAgencyUser",
  async (tenantId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/agency/user?tenantId=${tenantId}`);
      const data = await response.json();
      // API returns { users: IUser[] }
      console.log("getAgencyUser--->?", data.users);
      return data.users;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// create business user
export const createBusinessUser = createAsyncThunk<IUser, Partial<IUser>, { rejectValue: any }>(
  "user/createBusinessUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/business/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return data?.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// update business user
export const updateBusinessUser = createAsyncThunk<IUser, Partial<IUser>, { rejectValue: any }>(
  "user/updateBusinessUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/business/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return data?.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// delete business user
export const deleteBusinessUser = createAsyncThunk<IUser, string, { rejectValue: any }>(
  "user/deleteBusinessUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/business/users?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
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
