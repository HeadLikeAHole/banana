import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import authReducer from './features/auth/authSlice.ts';
import alertsReducer from './features/alerts/alertsSlice.ts';
import productsSlice from './features/products/productsSlice.ts';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        alerts: alertsReducer,
        products: productsSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;