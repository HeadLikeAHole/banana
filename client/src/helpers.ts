import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { AppDispatch, RootState } from './store.ts';

export const capitalize = (s: string): string => s ? s[0].toUpperCase() + s.slice(1) : '';

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
  rejectValue: {
    message: string
  }
}>();

export function authHeaders (getState: () => RootState) {
  const token = getState().auth.token;
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// for UI testing purposes
export function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
