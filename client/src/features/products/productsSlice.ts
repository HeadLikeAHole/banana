import { createSlice } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  userId: number;
  title: string;
  description: string;
  price: number;
  createdAt: Date,
  updatedAt: Date
}

export interface ProductListState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  data: Product[];
}

const initialState: ProductListState = {
  status: 'idle',
  message: '',
  data: []
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {

  }
});

export default productsSlice.reducer;