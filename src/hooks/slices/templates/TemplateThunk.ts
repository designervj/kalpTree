import { CreateTemplateInput, TemplateDocument, UpdateTemplateInput } from "@/components/templates/TemplateType";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Thunk to fetch all templates
export const fetchAllTemplates = createAsyncThunk(
    "templates/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/template");

            if (!response.ok) {
                throw new Error("Failed to fetch templates");
            }

            const data = await response.json();
            return data.templates as TemplateDocument[];
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch templates");
        }
    }
);

// Thunk to fetch template by templateId
export const fetchTemplateById = createAsyncThunk(
    "templates/fetchById",
    async (templateId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/template?templateId=${templateId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch template");
            }

            const data = await response.json();
            return data.template as TemplateDocument;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch template");
        }
    }
);

// Thunk to create a new template
export const createTemplate = createAsyncThunk(
    "templates/create",
    async (input: CreateTemplateInput, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/template", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create template");
            }

            const data = await response.json();
            return data.template as TemplateDocument;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to create template");
        }
    }
);

// Thunk to update an existing template
export const updateTemplate = createAsyncThunk(
    "templates/update",
    async (
        { templateId, input }: { templateId: string; input: UpdateTemplateInput },
        { rejectWithValue }
    ) => {
        try {
            const response = await fetch(`/api/template?templateId=${templateId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update template");
            }

            const data = await response.json();
            return data.template as TemplateDocument;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update template");
        }
    }
);

// Thunk to delete a template (soft delete)
export const deleteTemplate = createAsyncThunk(
    "templates/delete",
    async (templateId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/template?templateId=${templateId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete template");
            }

            const data = await response.json();
            return { deletedId: templateId, ...data };
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete template");
        }
    }
);

// Thunk to fetch templates by category
export const fetchTemplatesByCategory = createAsyncThunk(
    "templates/fetchByCategory",
    async (category: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/template?category=${category}`);

            if (!response.ok) {
                throw new Error("Failed to fetch templates by category");
            }

            const data = await response.json();
            return data.templates as TemplateDocument[];
        } catch (error: any) {
            return rejectWithValue(
                error.message || "Failed to fetch templates by category"
            );
        }
    }
);

// Thunk to search templates
export const searchTemplates = createAsyncThunk(
    "templates/search",
    async (query: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/template?search=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error("Failed to search templates");
            }

            const data = await response.json();
            return data.templates as TemplateDocument[];
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to search templates");
        }
    }
);
