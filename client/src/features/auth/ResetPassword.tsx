import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

import { ResetPasswordFormData, useResetPasswordMutation } from './authSlice.ts';
import { showAlert } from '../alerts/alertsSlice.ts';
import { useAppDispatch } from '../../hooks.ts';
import { isFetchBaseQueryError } from '../../helpers.ts';
import ValidationError from '../../components/ValidationError.tsx';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues
  } = useForm<ResetPasswordFormData>();

  const [resetPassword, { data, error, isSuccess, isError }] = useResetPasswordMutation();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ResetPasswordFormData> = formData => resetPassword(formData);

  if (isSuccess) {
    dispatch(showAlert({ type: 'success', message: data?.message }));
    navigate('/sign-in');
  }

  let errorMessage: string | undefined;

  if (isError) {
    if (
      isFetchBaseQueryError(error) &&
      typeof error.data === 'object' && error.data != null && 'message' in error.data &&
      typeof error.data.message === 'string'
    ) {
      errorMessage = error.data.message;
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>Reset Password</title>
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
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
          {errorMessage && <ValidationError error={errorMessage} />}
          <input {...register("token", { value: token ? token : "" })} type="hidden" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            Reset
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
