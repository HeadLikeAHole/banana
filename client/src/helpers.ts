import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store.ts';

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
