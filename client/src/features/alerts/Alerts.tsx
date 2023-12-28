import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert';

import { useAppSelector, useAppDispatch } from '../../hooks.ts';
import { selectAlerts } from './alertsSlice.ts';
import { closeAlert } from './alertsSlice.ts';

export default function Alerts() {
  const alerts = useAppSelector(selectAlerts);
  const dispatch = useAppDispatch();

  return (
    <>
      {
        alerts.map(alert => (
          <Slide direction="down" in={alert.isOpen} mountOnEnter unmountOnExit key={alert.id}>
            <Alert severity={alert.type} onClose={() => dispatch(closeAlert({ id: alert.id }))}>
              {alert.message}
            </Alert>
          </Slide>
        ))
      }
    </>
  );
}

// todo make alert to disappear after some time