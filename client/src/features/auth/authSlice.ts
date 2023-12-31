import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { server } from '../../config.ts';
import { authHeaders } from '../../helpers.ts';
import { showAlert } from '../alerts/alertsSlice.ts';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface UserState {
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string | undefined;
  user: User | null;
}

const initialState: UserState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  status: 'idle',
  user: null
}

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data, { dispatch, rejectWithValue }) => {
    const response = await fetch(`${server}/api/auth/sign-in`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const responseData = await response.json();
      return rejectWithValue(responseData)
    }

    const responseData = await response.json();

    dispatch(showAlert({ type: 'success', message: responseData.message }));

    return responseData;
  }
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { getState }) => {
    const response = await fetch(`${server}/api/auth/user`, {
      method: 'POST',
      headers: authHeaders(getState)
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(responseData.message)
    }

    return await response.json();
  }
);

function isPendingAction(action) {
  return action.type.endsWith('/pending');
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut() {
      localStorage.removeItem('token');
      return initialState;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.data.token);
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.status = 'success';
        state.message = action.payload.message
        state.user = action.payload.data.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'error';
        state.message = action.payload.message;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.status = 'success';
        state.message = action.payload.message
        state.user = action.payload.data;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = 'error';
      })
      .addMatcher(isPendingAction, (state) => {
        state.status = 'loading';
      })
  }
});

export const selectUser = state => state.auth;
export const selectUserToken = state => state.auth.token;

export const { signOut} = authSlice.actions;

export default authSlice.reducer;