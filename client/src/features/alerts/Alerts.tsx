import { useAppSelector } from '../../hooks.ts';
import { selectAlerts } from './alertsSlice.ts';
import Alert from './Alert.tsx';
import { Alert as AlertInterface } from './alertsSlice.ts';

export default function Alerts() {
  const alerts = useAppSelector<AlertInterface[]>(selectAlerts);

  return (
    <>
      {alerts.map(alert => <Alert alert={alert} />)}
    </>
  );
}
