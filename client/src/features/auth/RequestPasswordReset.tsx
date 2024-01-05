import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Helmet } from 'react-helmet';
import { ActionFunctionArgs, Form, Link as RouterLink, redirect, useActionData, useNavigation } from 'react-router-dom';

import { AppDispatch } from '../../store.ts';
import { server } from '../../config.ts';
import { showAlert } from '../alerts/alertsSlice.ts';

export function action(dispatch: AppDispatch) {
  return async function({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const response = await fetch(`${server}/api/auth/request-password-reset`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const responseData = await response.json();
      if (responseData.message) {
        return responseData.message
      }
    }

    const responseData = await response.json();

    dispatch(showAlert({ type: 'success', message: responseData.message }));

    return redirect('/');
  }
}

export default function RequestPasswordReset() {
  const { state } = useNavigation();
  const error = useActionData();

  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>Request Password Reset</title>
      </Helmet>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Password Reset
        </Typography>
        <Typography variant="subtitle2" sx={{ my: 1 }}>
          Enter your email and we'll send you instructions how to set a new password
        </Typography>
        {/* form with one text field doesn't take up 100% width of the parent container for some reason */}
        <Box component={Form} method="post" sx={{ width: 1 }}>
          <TextField
            error={!!error}
            helperText={error && error}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={state === 'submitting'}
          >
            Send
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/sign-in" variant="body2">
                Go back to sign-in page
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}