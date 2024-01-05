import { createSlice } from '@reduxjs/toolkit';

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
      const alert = {
        id: Math.random(),
        isOpen: true,
        type: action.payload.type,
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
export const selectAlerts = state => state.alerts.data;

export const { showAlert, closeAlert } = alertsSlice.actions;

export default alertsSlice.reducer;
