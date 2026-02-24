import { PageCommentModal, WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { ObjectId } from "mongodb";

export const fetchWebsitePages = createAsyncThunk<
  WebsitePageModel[],
  string | ObjectId,
  { rejectValue: string }
>("websitePage/fetchWebsitePages", async (tenantId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/pages/websites?tenantId=${tenantId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch pages");
    }
    const data = await response.json();
    console.log("data web pages", data);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch pages");
  }
});

export const createWebsitePage = createAsyncThunk<
  WebsitePageModel,
  Partial<WebsitePageModel>,
  { rejectValue: string }
>("websitePage/createWebsitePage", async (page, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/pages/websites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(page),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create page");
    }
    const data = await response.json();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to create page");
  }
});

export const updateWebsitePage = createAsyncThunk<
  WebsitePageModel,
  WebsitePageModel,
  { rejectValue: string }
>("websitePage/updateWebsitePage", async (page, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/pages/websites`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(page),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update page");
    }
    const data = await response.json();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update page");
  }
});

export const deleteWebsitePage = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("websitePage/deleteWebsitePage", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/pages/websites?id=${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete page"
    );
  }
});

// add comment
export const addComment = createAsyncThunk<
  PageCommentModal,
  { pageId: string, comment: PageCommentModal },
  { rejectValue: string }
>("websitePage/addComment", async ({ pageId, comment }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/pages/comment?id=${pageId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add comment");
    }
    const data = await response.json();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to add comment");
  }
});

// update comment
export const updateComment = createAsyncThunk<
  PageCommentModal,
  { pageId: string, comment: PageCommentModal },
  { rejectValue: string }
>("websitePage/updateComment", async ({ pageId, comment }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/pages/comment?pageId=${pageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update comment");
    }
    const data = await response.json();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update comment");
  }
});

// delete comment
export const deleteComment = createAsyncThunk<
  string,
  { pageId: string; commentId: string },
  { rejectValue: string }
>("websitePage/deleteComment", async ({ pageId, commentId }, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/pages/comment?pageId=${pageId}&commentId=${commentId}`);
    return commentId;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete comment"
    );
  }
});
