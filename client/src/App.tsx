import { ThemeProvider } from '@mui/material/';
import CssBaseline from '@mui/material/CssBaseline';
import Container from "@mui/material/Container";
import { Outlet } from 'react-router-dom';

import theme from './theme.ts';
import Alerts from './features/alerts/Alerts.tsx';
import Navbar from './components/Navbar.tsx';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Alerts />
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}
