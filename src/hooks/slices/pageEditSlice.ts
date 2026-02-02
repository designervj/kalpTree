import { PageModel } from '@/types/pages/PageModel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Thunk to save page (async)

import { AppDispatch, RootState } from '@/store/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { pageService } from '@/modules/website/page-service';
import { fetchFooterById } from './footer/FooterThunk';
import { ObjectId } from 'mongodb';
import { fetchCurrentHeaders } from './header/HeaderThunk';
interface PageEditState {
  page: PageModel | null;
  updatePage: PageModel | null;
  type: string;
  isLoading: boolean;
}

const initialState: PageEditState = {
  page: null,
  updatePage: null,
  type: "",
  isLoading: false
}
// Thunk to save page via API
export const savePageThunk = createAsyncThunk(
  'pageEdit/savePage',
  async (payload: { id: string | ObjectId; tenantId?: string | ObjectId, content: string }, { getState, dispatch }) => {
    const data = {
      id: payload.id,
      tenantId: payload.tenantId,
      content: payload.content
    }
    try {
      const response = await fetch(`/api/pages/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });


      if (!response.ok) throw new Error('Failed to save page');
      // Optionally update local state
      const { page } = (getState() as RootState).pageEdit;
      if (page) {
        dispatch(setPageEdit({ ...page, content: payload.content }));
      }
      return await response.json();
    } catch (error) {
      // Optionally handle error (e.g., show toast)
      throw error;
    }
  }
);


export const pageEditSlice = createSlice({
  name: 'pageEdit',
  initialState,
  reducers: {
    setPageEdit: (state, action) => {
      const { page, type } = action.payload;
      state.page = page;
      state.type = type
    },
    updatePage: (state, action) => {
      const { page, type } = action.payload;
      state.updatePage = page
      state.type = type

    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    clearPageEdit: (state) => {
      state.page = null;
      state.type = ""
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    //fetchFooterById 
    builder.addCase(fetchFooterById.fulfilled, (state, action) => {
      state.page = action.payload;
      state.type = "footer"
    });

    // fetch header by id
    builder.addCase(fetchCurrentHeaders.fulfilled, (state, action) => {
      state.page = action.payload[0];
      state.type = "header"
    });
  },
});






export const { setPageEdit, clearPageEdit, updatePage, setPageLoading } = pageEditSlice.actions;
export default pageEditSlice.reducer;
