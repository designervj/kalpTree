import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "@/models/user";

// Thunk to save page via API
export const savedashboardDetailsThunk = createAsyncThunk(
  "dashboard/savedashboard",
  async (payload: { agencyid: string; businessid: string; user: IUser }) => {
    try {
      const response = await fetch(`/api/appshell-data`);
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to save page");
      console.log("savedashboard", data);
      return {
        agencies: data.agencies,
        business: data.business,
        websites: data.websites,
        user: data.user,
        agencyid:
          payload.user.role == "business"
            ? data.agencies[0]._id
            : payload.agencyid,
        businessid:
          payload.user.role == "business"
            ? data.business[0]._id
            : payload.businessid,
      };
    } catch (error) {
      throw error;
    }
  },
);
