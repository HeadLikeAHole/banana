import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Helmet } from 'react-helmet';
import {
  ActionFunctionArgs,
  Form,
  Link as RouterLink, redirect,
  useActionData,
  useNavigation
} from 'react-router-dom';

import { server } from '../../config.ts';
import { showAlert } from '../alerts/alertsSlice.ts';
import { useAppSelector } from '../../hooks.ts';
import { selectUser } from '../auth/authSlice.ts';

export function action(dispatch) {
  return async function({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const response = await fetch(`${server}/api/auth/products`, {
      method: 'POST',
      body: formData,
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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function InputFileUpload() {
  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      sx={{ mt: 2 }}
    >
      Upload files
      <VisuallyHiddenInput type="file" name="images" multiple />
    </Button>
  );
}

export default function CreateProduct() {
  const token = useAppSelector(selectUser);
  const { state } = useNavigation();
  const errors = useActionData();

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
        <Box component={Form} method="post" encType="multipart/form-data">
          <TextField
            error={!!errors?.title}
            helperText={errors?.title && errors.title}
            margin="normal"
            required
            fullWidth
            id="title"
            name="title"
            label="Title"
            multiline
            rows="3"
            autoFocus
          />
          <TextField
            error={!!errors?.description}
            helperText={errors?.description && errors.description}
            margin="normal"
            required
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows="5"
          />
          <TextField
            error={!!errors?.price}
            helperText={errors?.price && errors.price}
            margin="normal"
            required
            fullWidth
            id="price"
            name="price"
            label="Price"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
          />
          <InputFileUpload />
          <input type="hidden" name="token" value={token ? token : ""} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={state === 'submitting'}
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
