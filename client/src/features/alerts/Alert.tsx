import { useEffect } from 'react';
import Slide from '@mui/material/Slide';
import MUIAlert from '@mui/material/Alert';

import { Alert as AlertInterface } from './alertsSlice.ts';
import { useAppDispatch } from '../../hooks.ts';
import { closeAlert } from './alertsSlice.ts';

const TIME_TO_SHOW = 5000;

export default function Alert({ alert }: { alert: AlertInterface }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(closeAlert({ id: alert.id })), TIME_TO_SHOW);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Slide direction="down" in={alert.isOpen} mountOnEnter unmountOnExit key={alert.id}>
      <MUIAlert severity={alert.severity} onClose={() => dispatch(closeAlert({ id: alert.id }))}>
        {alert.message}
      </MUIAlert>
    </Slide>
  );
}