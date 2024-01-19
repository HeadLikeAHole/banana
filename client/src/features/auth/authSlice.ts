import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store.ts';
import { apiSlice } from '../api/apiSlice.ts';
import { isFetchBaseQueryError } from '../../helpers.ts';

export interface SignUpFormData {
  email: string;
  password: string;
  confirm_password: string;
}

interface MessageResult {
  message: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

interface SignInResult {
  message: string;
  data: {
    token: string;
    user: User;
  };
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface GetUserResult {
  message: string;
  data: User;
}

export interface RequestPasswordResetFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
  confirm_password: string;
}

export const authAPISlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    signUp: builder.mutation<MessageResult, SignUpFormData>({
      query: body => ({
        url: '/api/auth/sign-up',
        method: 'POST',
        body
      })
    }),
    activateAccount: builder.query<MessageResult, string | null>({
      query: token => `/api/auth/activate-account?token=${token}`
    }),
    signIn: builder.mutation<SignInResult, SignInFormData>({
      query: body => ({
        url: '/api/auth/sign-in',
        method: 'POST',
        body
      }),
      invalidatesTags: ['User']
    }),
    getUser: builder.query<GetUserResult, void>({
      query: () => '/api/auth/user',
      providesTags: ['User']
    }),
    requestPasswordReset: builder.mutation<MessageResult, RequestPasswordResetFormData>({
      query: body => ({
        url: '/api/auth/request-password-reset',
        method: 'POST',
        body
      })
    }),
    resetPassword: builder.mutation<MessageResult, ResetPasswordFormData>({
      query: body => ({
        url: '/api/auth/reset-password',
        method: 'POST',
        body
      })
    })
  })
});

interface UserState {
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  user: User | null;
}

const initialState: UserState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  status: 'idle',
  message: '',
  user: null
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
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authAPISlice.endpoints.signIn.matchFulfilled,
        (state, { payload }) => {
          localStorage.setItem('token', payload.data.token);
          state.token = payload.data.token;
          state.isAuthenticated = true;
          state.status = 'success';
          state.message = payload.message;
          state.user = payload.data.user;
        }
      )
      .addMatcher(
        authAPISlice.endpoints.getUser.matchPending,
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        authAPISlice.endpoints.getUser.matchFulfilled,
        (state, { payload }) => {
          state.isAuthenticated = true;
          state.status = 'success';
          state.message = payload.message;
          state.user = payload.data;
        }
      )
      .addMatcher(
        authAPISlice.endpoints.getUser.matchRejected,
        (state, { payload }) => {
          state.isAuthenticated = false;
          state.status = 'error';
          if (
            isFetchBaseQueryError(payload) &&
            typeof payload.data === 'object' && payload.data != null && 'message' in payload.data &&
            typeof payload.data.message === 'string'
          ) {
              state.message = payload.data.message;
          }
        }
      )
  }
});

export const {
  useSignUpMutation,
  useActivateAccountQuery,
  useSignInMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation
} = authAPISlice;

export const selectUser = (state: RootState) => state.auth;

export const { signOut} = authSlice.actions;

export default authSlice.reducer;
