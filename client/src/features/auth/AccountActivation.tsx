import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { useActivateAccountQuery } from './authSlice.ts';
import { capitalize, isFetchBaseQueryError } from '../../helpers.ts';

export default function AccountActivation() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { data, error, isLoading, isSuccess, isError } = useActivateAccountQuery(token);

  const severity = isSuccess ? 'success' : 'error';

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
    <>
      <Helmet>
        <title>Account Activation</title>
      </Helmet>
      <Box sx={{ mx: 'auto', mt: 3, width: { md: 900 }, height: 75 }}>
        {isLoading ? (
          <Skeleton variant="rectangular" sx={{ height: 1 }} />
        ) : (
          <Alert severity={severity}>
            <AlertTitle>{capitalize(severity)}</AlertTitle>
            {isSuccess ? data?.message : errorMessage}
          </Alert>
        )}
      </Box>
    </>
  );
}
