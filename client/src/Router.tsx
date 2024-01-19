import { createBrowserRouter } from 'react-router-dom';

import App from './App.tsx';
import AuthRequired from './components/AuthRequired.tsx';
import SignUp from './features/auth/SignUp.tsx';
import AccountActivation from './features/auth/AccountActivation.tsx';
import SignIn from './features/auth/SignIn.tsx';
import RequestPasswordReset from './features/auth/RequestPasswordReset.tsx';
import ResetPassword from './features/auth/ResetPassword.tsx';
import CreateProduct from './features/products/CreateProduct.tsx';
import ProductDetail from './features/products/ProductDetail.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'sign-up',
        element: <SignUp />
      },
      {
        path: 'activate-account',
        element: <AccountActivation />
      },
      {
        path: 'sign-in',
        element: <SignIn />
      },
      {
        path: 'request-password-reset',
        element: <RequestPasswordReset />
      },
      {
        path: 'reset-password',
        element: <ResetPassword />
      },
      {
        path: 'products/create',
        element: <AuthRequired><CreateProduct /></AuthRequired>
      },
      // {
      //   path: 'products/:productID',
      //   element: <ProductDetail />
      // }
    ]
  }
]);
