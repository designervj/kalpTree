import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TemplateDocument } from "@/components/admin/templates/TemplateType";
import {
    fetchFooters,
    fetchFooterById,
    fetchFooterBySlug,
    createFooter,
    updateFooter,
    deleteFooter,
    fetchCurrentFooters,
} from "./FooterThunk";

export type FooterState = {
    allFooter: TemplateDocument[];
    currentFooter: TemplateDocument | null;
    hasFetched: boolean;
    isLoading: boolean;
};

const initialState: FooterState = {
    allFooter: [],
    currentFooter: null,
    hasFetched: false,
    isLoading: false,
};

const footerSlice = createSlice({
    name: "footer",
    initialState,
    reducers: {
        setFooters(state, action: PayloadAction<TemplateDocument[]>) {
            state.allFooter = action.payload;
        },
        setCurrentFooter(state, action: PayloadAction<TemplateDocument | null>) {
            state.currentFooter = action.payload;
        },
        addFooter(state, action: PayloadAction<TemplateDocument>) {
            state.allFooter.push(action.payload);
        },
        updateFooterLocal(state, action: PayloadAction<TemplateDocument>) {
            const updated = action.payload;
            const idx = state.allFooter.findIndex((f) => {
                if (!f) return false;
                if ((f as any)._id && (updated as any)._id)
                    return String((f as any)._id) === String((updated as any)._id);
                return f.slug === updated.slug;
            });
            if (idx !== -1) {
                state.allFooter[idx] = {
                    ...state.allFooter[idx],
                    ...updated,
                };
            }
            // Update currentFooter if it matches
            if (
                state.currentFooter &&
                String((state.currentFooter as any)._id) === String((updated as any)._id)
            ) {
                state.currentFooter = { ...state.currentFooter, ...updated };
            }
        },
        removeFooter(state, action: PayloadAction<string | undefined>) {
            const id = action.payload;
            state.allFooter = state.allFooter.filter((f) => {
                if (!f) return false;
                if ((f as any)._id && id) return String((f as any)._id) !== String(id);
                return f.slug !== String(id);
            });
            // Clear currentFooter if it was removed
            if (
                state.currentFooter &&
                String((state.currentFooter as any)._id) === String(id)
            ) {
                state.currentFooter = null;
            }
        },
        clearFooters(state) {
            state.allFooter = [];
            state.currentFooter = null;
            state.hasFetched = false;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all footers
            .addCase(fetchFooters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                fetchFooters.fulfilled,
                (state, action: PayloadAction<TemplateDocument[]>) => {
                    
                       state.currentFooter = action.payload[0];
                        state.hasFetched = true;
                        state.isLoading = false;
                    
                }
            )
            .addCase(fetchFooters.rejected, (state) => {
                state.isLoading = false;
            })


            // Create footer
            .addCase(createFooter.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createFooter.fulfilled, (state, action) => {
                if (action.payload?.data) {
                     state.currentFooter = action.payload.data;
                }
                state.isLoading = false;
            })
            .addCase(createFooter.rejected, (state) => {
                state.isLoading = false;
            })
            
            // Delete footer
            .addCase(deleteFooter.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteFooter.fulfilled, (state, action: PayloadAction<string>) => {
                const id = action.payload;
                state.allFooter = state.allFooter.filter(
                    (f) => String((f as any)._id) !== String(id)
                );
                // Clear currentFooter if it was deleted
                if (
                    state.currentFooter &&
                    String((state.currentFooter as any)._id) === String(id)
                ) {
                    state.currentFooter = null;
                }
                state.isLoading = false;
            })
            .addCase(deleteFooter.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {
    setFooters,
    setCurrentFooter,
    addFooter,
    updateFooterLocal,
    removeFooter,
    clearFooters,
} = footerSlice.actions;

export default footerSlice.reducer;

export const selectAllFooters = (state: { footer: FooterState }) =>
    state.footer.allFooter;

export const selectCurrentFooter = (state: { footer: FooterState }) =>
    state.footer.currentFooter;

export const selectFootersLoading = (state: { footer: FooterState }) =>
    state.footer.isLoading;

export const selectFootersHasFetched = (state: { footer: FooterState }) =>
    state.footer.hasFetched;
