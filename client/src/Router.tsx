import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './hooks.ts';
import { selectUserToken } from './features/auth/authSlice.ts';
import App from './App.tsx';
import AuthRequired from './components/AuthRequired.tsx';
import SignUp, { action as signUpAction } from './features/auth/SignUp.tsx';
import AccountActivation from './features/auth/AccountActivation.tsx';
import SignIn, { action as signInAction } from './features/auth/SignIn.tsx';
import { action as signOutAction } from './features/auth/signOut.ts';
import RequestPasswordReset, { action as requestPasswordResetAction } from './features/auth/RequestPasswordReset.tsx';
import ResetPassword, { action as resetPasswordAction } from './features/auth/ResetPassword.tsx';
import CreateProduct, { action as createProductAction } from './features/products/CreateProduct.tsx';

export default function Router() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectUserToken);

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
        {
          path: '/products/create',
          element: <AuthRequired><CreateProduct /></AuthRequired>,
          action: createProductAction(dispatch, token)
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}
