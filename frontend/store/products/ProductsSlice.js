import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetJSON, API_BASE } from "../baseApi";

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (searchQuery = '') => {
    try {
      const url = searchQuery ? `${API_BASE}/products?search=${encodeURIComponent(searchQuery)}` : `${API_BASE}/products`;
      const data = await GetJSON(url);
      return data;
    } catch (err) {
      console.error("Error fetching products:", err);
      return {};
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: {},
    searchResults: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'success';
        if (action.payload && action.payload.categorized) {
          state.list = action.payload.categorized;
          state.searchResults = action.payload.flat;
        } else {
          state.list = action.payload;
          state.searchResults = [];
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const selectProducts = (state) => state.products.list;
export const selectSearchResults = (state) => state.products.searchResults;
export default productsSlice.reducer;