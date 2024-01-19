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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useAppSelector, useAppDispatch } from '../../hooks.ts';
import { SignUpFormData, useSignUpMutation, selectUser } from './authSlice.ts';
import { showAlert } from '../alerts/alertsSlice.ts';
import { isFetchBaseQueryError } from '../../helpers.ts';

export default function SignUp() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    getValues
  } = useForm<SignUpFormData>();

  const [signUp, { data, error, isSuccess, isError }] = useSignUpMutation();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { isAuthenticated } = useAppSelector(selectUser);

  const onSubmit: SubmitHandler<SignUpFormData> = formData => signUp(formData);

  if (isSuccess) {
    dispatch(showAlert({ type: 'success', message: data?.message }));
    navigate('/');
  }

  useEffect(() => {
    if (isError) {
      if (
        isFetchBaseQueryError(error) &&
        typeof error.data === 'object' && error.data != null && 'errors' in error.data &&
        typeof error.data.errors === 'object' && error.data.errors != null
      ) {
        for (const key in error.data.errors) {
          if (key === 'email' || key === 'password' || key === 'confirm_password') {
            setError(key, { message: error.data.errors[key as keyof typeof error.data.errors] });
          }
        }
      }
    }
  }, [isError]);

  // todo see if it can be implemented without effect hook
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

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
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email",
              }
            })}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
          />
          <TextField
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 2,
                message: 'Password must contain at least 2 characters'
              }
            })}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            {...register('confirm_password', {
              required: 'Password confirmation is required',
              minLength: {
                value: 2,
                message: 'Password must contain at least 2 characters'
              },
              validate: value => {
                return value === getValues('password') || 'Passwords must match'
              }
            })}
            error={!!errors.confirm_password}
            helperText={errors.confirm_password && errors.confirm_password.message}
            margin="normal"
            fullWidth
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
            disabled={isSubmitting}
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
