import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store.ts';

type AlertSeverity = 'success' | 'warning' | 'error' | 'info';

export interface Alert {
  id: number,
  isOpen: boolean,
  severity: AlertSeverity;
  message: string;
}

interface AlertsState {
  data: Alert[];
}

const initialState: AlertsState = {
  data: []
}

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    showAlert(state, action) {
      const alert: Alert = {
        id: Math.random(),
        isOpen: true,
        severity: action.payload.type,
        message: action.payload.message
      };
      state.data.push(alert);
    },
    closeAlert(state, action) {
      const index = state.data.findIndex(alert => alert.id === action.payload.id);
      if (index !== -1) {
        state.data[index].isOpen = false;
      }
    }
  }
});

// todo memoize selector
export const selectAlerts = (state: RootState) => state.alerts.data;

export const { showAlert, closeAlert } = alertsSlice.actions;

export default alertsSlice.reducer;
