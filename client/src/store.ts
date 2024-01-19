import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import { apiSlice } from './features/api/apiSlice';
import authReducer from './features/auth/authSlice.ts';
import alertsReducer from './features/alerts/alertsSlice.ts';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        alerts: alertsReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
