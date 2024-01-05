import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Spinner() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );
}