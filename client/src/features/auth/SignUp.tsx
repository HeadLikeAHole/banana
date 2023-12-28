import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Helmet } from 'react-helmet';
import { Form, Link as RouterLink, redirect, useActionData, useNavigate, useNavigation } from 'react-router-dom';
import type { ActionFunctionArgs } from 'react-router-dom';

import { useAppSelector } from '../../hooks.ts';
import { server } from '../../config.ts';
import { showAlert } from '../alerts/alertsSlice.ts';
import { selectUser } from './authSlice.ts';

interface ActionData {
  email?: string;
  password?: string;
  confirm_password?: string;
}

export function action(dispatch) {
  return async function({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const response = await fetch(`${server}/api/auth/sign-up`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const responseData = await response.json();
      if (responseData.errors) {
        return responseData.errors
      }
      throw new Error(responseData.message)
    }

    const responseData = await response.json();

    dispatch(showAlert({ type: 'success', message: responseData.message }));

    return redirect('/');
  }
}

export default function SignUp() {
  const navigate = useNavigate();
  const { state } = useNavigation();
  const { isAuthenticated } = useAppSelector(selectUser);
  const errors = useActionData();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated])

  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>Sign Up</title>
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
          Sign Up
        </Typography>
        <Box component={Form} method="post">
          <TextField
            error={!!errors?.email}
            helperText={errors?.email && errors.email}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            error={!!errors?.password}
            helperText={errors?.password && errors.password}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            error={!!errors?.confirm_password}
            helperText={errors?.confirm_password && errors.confirm_password}
            margin="normal"
            required
            fullWidth
            name="confirm_password"
            label="Confirm Password"
            type="password"
            id="confirm_password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={state === 'submitting'}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/sign-in" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
