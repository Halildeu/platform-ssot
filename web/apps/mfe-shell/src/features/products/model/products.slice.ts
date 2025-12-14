import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductsState } from '@mfe/shared-types';

// Sahte API fonksiyonu
const fetchProductsAPI = async () => {
  const products = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Klavye' },
    { id: 3, name: 'Mouse' },
  ];
  return new Promise<{ data: typeof products }>((resolve) =>
    setTimeout(() => resolve({ data: products }), 1000)
  );
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetchProductsAPI();
    return response.data;
  }
);

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Bir hata oluştu.';
      });
  },
});

export default productsSlice.reducer;