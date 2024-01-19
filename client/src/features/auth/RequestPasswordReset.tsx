import { useEffect } from 'react';
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

import { RequestPasswordResetFormData, useRequestPasswordResetMutation } from './authSlice.ts';
import { showAlert } from '../alerts/alertsSlice.ts';
import { useAppDispatch } from '../../hooks.ts';
import { isFetchBaseQueryError } from '../../helpers.ts';

export default function RequestPasswordReset() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<RequestPasswordResetFormData>();

  const [requestPasswordReset, { data, error, isSuccess, isError }] = useRequestPasswordResetMutation();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RequestPasswordResetFormData> = formData => requestPasswordReset(formData);

  if (isSuccess) {
    dispatch(showAlert({ type: 'success', message: data?.message }));
    navigate('/');
  }

  useEffect(() => {
    if (isError) {
      if (
        isFetchBaseQueryError(error) &&
        typeof error.data === 'object' && error.data != null && 'message' in error.data &&
        typeof error.data.message === 'string'
      ) {
        setError('email', { message: error.data.message });
      }
    }
  }, [isError]);

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
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: 1 }}>
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
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