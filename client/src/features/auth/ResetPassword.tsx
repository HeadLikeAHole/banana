import {
  ActionFunctionArgs,
  Form,
  Link as RouterLink,
  redirect,
  useActionData,
  useNavigation,
  useSearchParams
} from "react-router-dom";
import {server} from "../../config.ts";
import {showAlert} from "../alerts/alertsSlice.ts";
import {Helmet} from "react-helmet";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";

export function action(dispatch) {
  return async function({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const response = await fetch(`${server}/api/auth/reset-password`, {
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

    return redirect('/sign-in');
  }
}

export default function ResetPassword() {
  const { state } = useNavigation();
  const errors = useActionData();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

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
        <Box component={Form} method="post">
          <TextField
            error={!!errors?.password}
            helperText={errors?.password && errors.password}
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
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
            label="Confirm New Password"
            type="password"
            id="confirm_password"
            autoComplete="current-password"
          />
          <input type="hidden" name="token" value={token ? token : ""} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={state === 'submitting'}
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