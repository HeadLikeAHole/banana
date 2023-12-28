import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { useAppDispatch } from './hooks.ts';
import App from './App.tsx';
import SignUp, { action as signUpAction } from './features/auth/SignUp.tsx';
import AccountActivation from './features/auth/AccountActivation.tsx';
import SignIn, { action as signInAction } from './features/auth/SignIn.tsx';
import { action as signOutAction } from './components/Navbar.tsx';
import RequestPasswordReset, { action as requestPasswordResetAction } from './features/auth/RequestPasswordReset.tsx';
import ResetPassword, { action as resetPasswordAction } from './features/auth/ResetPassword.tsx';

export default function Router() {
  const dispatch = useAppDispatch();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '/sign-up',
          element: <SignUp />,
          action: signUpAction(dispatch)
        },
        {
          path: '/activate-account',
          element: <AccountActivation />
        },
        {
          path: '/sign-in',
          element: <SignIn />,
          action: signInAction(dispatch)
        },
        {
          path: '/sign-out',
          action: signOutAction(dispatch)
        },
        {
          path: '/request-password-reset',
          element: <RequestPasswordReset />,
          action: requestPasswordResetAction(dispatch)
        },
        {
          path: '/reset-password',
          element: <ResetPassword />,
          action: resetPasswordAction(dispatch)
        },
      ]
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

// todo password reset