import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetJSON, API_BASE } from "../baseApi";

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    try {
      const data = await GetJSON(`${API_BASE}/products`);
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
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const selectProducts = (state) => state.products.list;
export default productsSlice.reducer;