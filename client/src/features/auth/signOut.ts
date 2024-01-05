import { redirect } from 'react-router-dom';

import { AppDispatch } from '../../store.ts';
import { signOut } from './authSlice.ts';
import { showAlert } from '../alerts/alertsSlice.ts';

export function action(dispatch: AppDispatch) {
  return async function() {
    dispatch(signOut());
    dispatch(showAlert({ type: 'success', message: 'You have successfully signed out' }));

    return redirect('/');
  }
}
