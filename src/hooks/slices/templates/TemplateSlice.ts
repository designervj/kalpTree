import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createTemplate, deleteTemplate, fetchAllTemplates, fetchTemplateById, updateTemplate } from "./TemplateThunk";
import { TemplateDocument } from "@/components/templates/TemplateType";


interface TemplateState {
    allTemplate: TemplateDocument[];
    currentTemplate: TemplateDocument | null;
    hasFetched: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: TemplateState = {
    allTemplate: [],
    currentTemplate: null,
    hasFetched: false,
    isLoading: false,
    error: null,
};

const templateSlice = createSlice({
    name: "templates",
    initialState,
    reducers: {
        setTemplates(state, action: PayloadAction<TemplateDocument[]>) {
            state.allTemplate = action.payload;
            state.hasFetched = true;

            // If currentTemplate is not set, pick the first one
            if (!state.currentTemplate && action.payload.length > 0) {
                state.currentTemplate = action.payload[0];
            }
        },
        clearTemplates(state) {
            state.allTemplate = [];
            state.currentTemplate = null;
            state.hasFetched = false;
        },
        setCurrentTemplate(state, action: PayloadAction<TemplateDocument | null>) {
            state.currentTemplate = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all templates
            .addCase(fetchAllTemplates.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllTemplates.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allTemplate = action.payload;
                state.hasFetched = true;
            })
            .addCase(fetchAllTemplates.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch template by ID
            .addCase(fetchTemplateById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTemplateById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentTemplate = action.payload;
                // Also update in allTemplate array if it exists
                const index = state.allTemplate.findIndex(
                    (t) => t._id.toString() === action.payload._id.toString()
                );
                if (index !== -1) {
                    state.allTemplate[index] = action.payload;
                } else {
                    state.allTemplate.push(action.payload);
                }
            })
            .addCase(fetchTemplateById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create template
            .addCase(createTemplate.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTemplate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allTemplate.push(action.payload);
                state.currentTemplate = action.payload;
            })
            .addCase(createTemplate.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update template
            .addCase(updateTemplate.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTemplate.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.allTemplate.findIndex(
                    (t) => t._id.toString() === action.payload._id.toString()
                );
                if (index !== -1) {
                    state.allTemplate[index] = action.payload;
                }
                // Update currentTemplate if it's the same one
                if (
                    state.currentTemplate?._id.toString() ===
                    action.payload._id.toString()
                ) {
                    state.currentTemplate = action.payload;
                }
            })
            .addCase(updateTemplate.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete template
            .addCase(deleteTemplate.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteTemplate.fulfilled, (state, action) => {
                state.isLoading = false;
                const deletedId = action.payload.deletedId;
                // Remove from allTemplate array
                state.allTemplate = state.allTemplate.filter(
                    (t: TemplateDocument) => t._id.toString() !== deletedId
                );
                // Clear currentTemplate if it was the deleted one
                if (state.currentTemplate?._id.toString() === deletedId) {
                    state.currentTemplate =
                        state.allTemplate.length > 0 ? state.allTemplate[0] : null;
                }
            })
            .addCase(deleteTemplate.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setTemplates, clearTemplates, setCurrentTemplate } =
    templateSlice.actions;
export default templateSlice.reducer;
