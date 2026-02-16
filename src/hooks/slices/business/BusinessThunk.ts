import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBusiness } from "@/models/business";
import { Pagination } from "./BusinessSlice";
import { initialProfileData } from "@/app/admin/websites/[website]/branding/brand-profile/page";

// Type definitions for Create and Update inputs
export interface CreateBusinessInput {
  slug: string;
  name: string;
  email: string;
  plan?: "trial" | "free" | "pro" | "agency";
  subscriptionStatus?: "active" | "paused" | "cancelled";
  customDomainVerified?: boolean;
  branding?: {
    colors?: {
      primary?: string;
      secondary?: string;
    };
  };
  paymentGateways?: Record<string, any>;
  features?: {
    websiteEnabled?: boolean;
    ecommerceEnabled?: boolean;
    blogEnabled?: boolean;
    invoicesEnabled?: boolean;
  };
  settings?: {
    locale?: string;
    currency?: string;
    timezone?: string;
  };
  status?: "active" | "paused" | "inactive";
  type?: "business" | "franchise" | "agency";
  tenantId?: string;
}

export interface UpdateBusinessInput {
  slug?: string;
  name?: string;
  email?: string;
  plan?: "trial" | "free" | "pro" | "agency";
  subscriptionStatus?: "active" | "paused" | "cancelled";
  customDomainVerified?: boolean;
  branding?: {
    colors?: {
      primary?: string;
      secondary?: string;
    };
  };
  paymentGateways?: Record<string, any>;
  features?: {
    websiteEnabled?: boolean;
    ecommerceEnabled?: boolean;
    blogEnabled?: boolean;
    invoicesEnabled?: boolean;
  };
  settings?: {
    locale?: string;
    currency?: string;
    timezone?: string;
  };
  status?: "active" | "paused" | "inactive";
  type?: "business" | "franchise" | "agency";
  tenantId?: string;
}

// Thunk to fetch all businesses
export const fetchAllBusinesses = createAsyncThunk(
  "business/fetchAll",
  async (
    {
      page = 1,
      itemsperpage = 30,
      tenantId
    }: {
      page: number;
      itemsperpage: number;
      tenantId?: string;
    },

    { rejectWithValue }
  ) => {


    try {
      const response = await fetch(
        `/api/admin/business?page=${page}&itemsperpage=${itemsperpage}&type=business&tenantId=${tenantId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch businesses");
      }

      const data = await response.json();
      return data as {
        pagination: Pagination;
        data: IBusiness[];
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch businesses");
    }
  }
);

// Thunk to fetch business by businessId
export const fetchBusinessById = createAsyncThunk(
  "business/fetchById",
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/admin/business?id=${businessId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch business");
      }

      const data = await response.json();
      return {
        business: data.data as IBusiness[],
        businessId: businessId,

      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch business");
    }
  }
);

// Thunk to fetch business by slug
export const fetchBusinessBySlug = createAsyncThunk(
  "business/fetchBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/business?slug=${slug}`);

      if (!response.ok) {
        throw new Error("Failed to fetch business");
      }

      const data = await response.json();
      return data.business as IBusiness;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch business");
    }
  }
);

// Thunk to create a new business
export const createBusiness = createAsyncThunk(
  "business/create",
  async (input: CreateBusinessInput, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create business");
      }

      const data = await response.json();
      return data.business as IBusiness;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create business");
    }
  }
);

// Thunk to update an existing business
export const updateBusiness = createAsyncThunk(
  "business/update",
  async (
    { businessId, input, password }: { businessId: string; input: IBusiness , password?:string},
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `/api/admin/business?businessId=${businessId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update business");
      }

      const data = await response.json();
      return {
        business: input as IBusiness,
        success: true,
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update business");
    }
  }
);

// Thunk to delete a business (soft delete)
export const deleteBusiness = createAsyncThunk(
  "business/delete",
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/admin/business?businessId=${businessId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete business");
      }

      const data = await response.json();
      return { deletedId: businessId, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete business");
    }
  }
);

// Thunk to fetch businesses by tenant
export const fetchBusinessesByTenant = createAsyncThunk(
  "business/fetchByTenant",
  async (tenantId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/business?tenantId=${tenantId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch businesses by tenant");
      }

      const data = await response.json();
      return data.businesses as IBusiness[];
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch businesses by tenant"
      );
    }
  }
);

// Thunk to fetch businesses by plan
export const fetchBusinessesByPlan = createAsyncThunk(
  "business/fetchByPlan",
  async (plan: "trial" | "free" | "pro" | "agency", { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/business?plan=${plan}`);

      if (!response.ok) {
        throw new Error("Failed to fetch businesses by plan");
      }

      const data = await response.json();
      return data.businesses as IBusiness[];
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch businesses by plan"
      );
    }
  }
);

// Thunk to search businesses
export const searchBusinesses = createAsyncThunk(
  "business/search",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/admin/business?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to search businesses");
      }

      const data = await response.json();
      return data.businesses as IBusiness[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search businesses");
    }
  }
);
// create athunk to update business branding
export const updateBusinessBranding = createAsyncThunk(
  "business/updateBranding",
  async (input: initialProfileData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/branding/brandingProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update business branding");
      }
     
      const data = await response.json();
       console.log("response --- update branding", data);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update business branding");
    }
  }
);
