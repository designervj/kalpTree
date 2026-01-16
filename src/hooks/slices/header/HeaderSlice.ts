import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HeaderDataModel } from "@/components/admin/header/HeaderType";
import {
    fetchHeaders,
    fetchHeaderById,
    fetchHeaderBySlug,
    createHeader,
    updateHeader,
    deleteHeader,
    fetchCurrentHeaders,
} from "./HeaderThunk";
import { TemplateDocument } from "@/components/admin/templates/TemplateType";

export type HeaderState = {
    allHeader: TemplateDocument[];
    currentHeader: TemplateDocument | null;
    hasFetched: boolean;
    isLoading: boolean;
};

const initialState: HeaderState = {
    allHeader: [],
    currentHeader: null,
    hasFetched: false,
    isLoading: false,
};

const headerSlice = createSlice({
    name: "header",
    initialState,
    reducers: {
        setHeaders(state, action: PayloadAction<TemplateDocument[]>) {
            state.allHeader = action.payload;
        },
        setCurrentHeader(state, action: PayloadAction<TemplateDocument | null>) {
            state.currentHeader = action.payload;
        },
        addHeader(state, action: PayloadAction<TemplateDocument>) {
            state.allHeader.push(action.payload);
        },
        updateHeaderLocal(state, action: PayloadAction<TemplateDocument>) {
            const updated = action.payload;
            const idx = state.allHeader.findIndex((h) => {
                if (!h) return false;
                if ((h as any)._id && (updated as any)._id)
                    return String((h as any)._id) === String((updated as any)._id);
                return h.slug === updated.slug;
            });
            if (idx !== -1) {
                state.allHeader[idx] = {
                    ...state.allHeader[idx],
                    ...updated,
                };
            }
            // Update currentHeader if it matches
            if (
                state.currentHeader &&
                String((state.currentHeader as any)._id) === String((updated as any)._id)
            ) {
                state.currentHeader = { ...state.currentHeader, ...updated };
            }
        },
        removeHeader(state, action: PayloadAction<string | undefined>) {
            const id = action.payload;
            state.allHeader = state.allHeader.filter((h) => {
                if (!h) return false;
                if ((h as any)._id && id) return String((h as any)._id) !== String(id);
                return h.slug !== String(id);
            });
            // Clear currentHeader if it was removed
            if (
                state.currentHeader &&
                String((state.currentHeader as any)._id) === String(id)
            ) {
                state.currentHeader = null;
            }
        },
        clearHeaders(state) {
            state.allHeader = [];
            state.currentHeader = null;
            state.hasFetched = false;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all headers
            .addCase(fetchHeaders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                fetchHeaders.fulfilled,
                (state, action: PayloadAction<TemplateDocument[]>) => {
                    if (action.payload && action.payload.length) {
                        state.allHeader = action.payload;
                        state.hasFetched = true;
                        state.isLoading = false;
                    }
                }
            )
            .addCase(fetchHeaders.rejected, (state) => {
                state.isLoading = false;
            })


            //fetch current header
            .addCase(fetchCurrentHeaders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                fetchCurrentHeaders.fulfilled,
                (state, action: PayloadAction<TemplateDocument[]>) => {
                    state.currentHeader = action.payload[0];
                    state.hasFetched = true;
                    state.isLoading = false;
                }
            )
            .addCase(fetchCurrentHeaders.rejected, (state) => {
                state.isLoading = false;
            })  
            // Fetch header by ID
            .addCase(fetchHeaderById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                fetchHeaderById.fulfilled,
                (state, action: PayloadAction<TemplateDocument>) => {
                    state.currentHeader = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(fetchHeaderById.rejected, (state) => {
                state.isLoading = false;
            })
            // Fetch header by slug
            .addCase(fetchHeaderBySlug.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                fetchHeaderBySlug.fulfilled,
                (state, action: PayloadAction<TemplateDocument | null>) => {
                    state.currentHeader = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(fetchHeaderBySlug.rejected, (state) => {
                state.isLoading = false;
            })
            // Create header
            .addCase(createHeader.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createHeader.fulfilled, (state, action) => {
                if (action.payload?.data) {
                    // state.allHeader.push(action.payload.data);
                    state.currentHeader = action.payload.data;
                }
                state.isLoading = false;
            })
            .addCase(createHeader.rejected, (state) => {
                state.isLoading = false;
            })
            // Update header
            .addCase(updateHeader.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                updateHeader.fulfilled,
                (state, action: PayloadAction<TemplateDocument>) => {
                    const updated = action.payload;
                    const idx = state.allHeader.findIndex(
                        (h) => String((h as any)._id) === String((updated as any)._id)
                    );
                    if (idx !== -1) {
                        state.allHeader[idx] = { ...state.allHeader[idx], ...updated };
                    }
                    // Update currentHeader if it matches
                    if (
                        state.currentHeader &&
                        String((state.currentHeader as any)._id) ===
                        String((updated as any)._id)
                    ) {
                        state.currentHeader = { ...state.currentHeader, ...updated };
                    }
                    state.isLoading = false;
                }
            )
            .addCase(updateHeader.rejected, (state) => {
                state.isLoading = false;
            })
            // Delete header
            .addCase(deleteHeader.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteHeader.fulfilled, (state, action: PayloadAction<string>) => {
                const id = action.payload;
                state.allHeader = state.allHeader.filter(
                    (h) => String((h as any)._id) !== String(id)
                );
                // Clear currentHeader if it was deleted
                if (
                    state.currentHeader &&
                    String((state.currentHeader as any)._id) === String(id)
                ) {
                    state.currentHeader = null;
                }
                state.isLoading = false;
            })
            .addCase(deleteHeader.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {
    setHeaders,
    setCurrentHeader,
    addHeader,
    updateHeaderLocal,
    removeHeader,
    clearHeaders,
} = headerSlice.actions;

export default headerSlice.reducer;

export const selectAllHeaders = (state: { header: HeaderState }) =>
    state.header.allHeader;

export const selectCurrentHeader = (state: { header: HeaderState }) =>
    state.header.currentHeader;

export const selectHeadersLoading = (state: { header: HeaderState }) =>
    state.header.isLoading;

export const selectHeadersHasFetched = (state: { header: HeaderState }) =>
    state.header.hasFetched;
