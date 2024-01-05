import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import { useAppSelector } from '../hooks.ts';
import { selectUser } from '../features/auth/authSlice.ts';
import Spinner from './Spinner.tsx';

type Props = {
  children: React.ReactNode
};

export default function AuthRequired({ children }: Props) {
  const { isAuthenticated, status } = useAppSelector(selectUser);
  const location = useLocation();

  if (status === 'loading') {
    return <Spinner />
  } else if (!isAuthenticated) {
    return <Navigate to={`/sign-in?path=${location.pathname}`} replace />
  }

  return children;
};

// todo fix navigate bug