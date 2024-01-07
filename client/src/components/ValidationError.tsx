import Grid from '@mui/material/Grid';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

export default function ValidationError({ error }: { error: string }) {
  return (
    <Grid container spacing={0.3} sx={{ mt: 0.5, color: red[700] }}>
      <Grid item>
        <ErrorIcon fontSize="small" />
      </Grid>
      <Grid item>
        <Typography variant="body2">
          {error}
        </Typography>
      </Grid>
    </Grid>
  );
}