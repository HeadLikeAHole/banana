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
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useAppSelector, useAppDispatch } from '../../hooks.ts';
import { selectUser, SignInFormData, useSignInMutation } from './authSlice.ts';
import { showAlert } from "../alerts/alertsSlice.ts";
import { isFetchBaseQueryError } from '../../helpers.ts';

export default function SignIn() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<SignInFormData>();

  const [signIn, { data, error, isSuccess, isError }] = useSignInMutation();

  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector(selectUser);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const onSubmit: SubmitHandler<SignInFormData> = formData => signIn(formData);

  useEffect(() => {
    if (isSuccess) {
      dispatch(showAlert({ type: 'success', message: data?.message }));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      if (
        isFetchBaseQueryError(error) &&
        typeof error.data === 'object' && error.data != null && 'message' in error.data &&
        typeof error.data.message === 'string'
      ) {
        setError('password', { message: error.data.message });
      }
    }
  }, [isError]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(searchParams.get('path') || '/');
    }
  }, [isAuthenticated]);

  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>Sign In</title>
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
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('email')}
            error={isError}
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
          />
          <TextField
            {...register('password')}
            error={isError}
            helperText={errors.password && errors.password.message}
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="/request-password-reset" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
