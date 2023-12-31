import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { server } from '../../config.ts';
import { authHeaders } from '../../helpers.ts';
import { showAlert } from '../alerts/alertsSlice.ts';

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