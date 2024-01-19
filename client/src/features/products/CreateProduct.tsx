import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

import { showAlert } from '../alerts/alertsSlice.ts';
import { CreateProductFormData, useCreateProductMutation } from './productsSlice.ts';
import ValidationError from '../../components/ValidationError.tsx';
import { useAppDispatch } from '../../hooks.ts';
import { isFetchBaseQueryError } from '../../helpers.ts';

export default function CreateProduct() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<CreateProductFormData>();

  const [createProduct, { data, error, isSuccess, isError }] = useCreateProductMutation();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CreateProductFormData> = formData => createProduct(formData);

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
          if (key === 'title' || key === 'description' || key === 'price' || key === 'images') {
            setError(key, { message: error.data.errors[key as keyof typeof error.data.errors] });
          }
        }
      }
    }
  }, [isError]);

  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>Create Product</title>
      </Helmet>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Create Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <TextField
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title && errors.title.message}
            margin="normal"
            fullWidth
            id="title"
            label="Title"
            multiline
            rows="3"
            autoFocus
          />
          <TextField
            {...register('description', { required: 'Description is required' })}
            error={!!errors.description}
            helperText={errors.description && errors.description.message}
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            multiline
            rows="5"
          />
          <TextField
            {...register('price', {
              required: 'Price is required',
              validate: value => !isNaN(Number(value)) || 'Enter a valid number'
            })}
            error={!!errors.price}
            helperText={errors.price && errors.price.message}
            margin="normal"
            fullWidth
            id="price"
            label="Price"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
          />
          <Box sx={{ mt: 1 }}>
            <input
              {...register('images', { required: 'Images are required' })}
              type="file"
              multiple
            />
          </Box>
          {errors.images?.message && <ValidationError error={errors.images.message} />}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            OK
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
