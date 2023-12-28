import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Helmet } from 'react-helmet';

import { server } from '../../config.ts';

export default function AccountActivation() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('success');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const severity = status === 'success' ? 'success' : 'error';
  const title = status === 'success' ? 'Success' : 'Error';

  useEffect(() => {
    async function activateAccount() {
      // todo possibly refactor to try/catch
      const response = await fetch(`${server}/api/auth/activate-account?token=${token}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        setStatus('error');
      }
      const data = await response.json();
      setMessage(data?.message);
      setIsLoading(false);
    }

    activateAccount();
  }, []);

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
            <AlertTitle>{title}</AlertTitle>
            {message}
          </Alert>
        )}
      </Box>
    </>
  );
}