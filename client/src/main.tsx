import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import './index.css';
import { store } from './store.ts';
import { router } from './router.tsx';
import { authAPISlice } from './features/auth/authSlice.ts';

function start() {
  store.dispatch(authAPISlice.endpoints.getUser.initiate());

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
}

start();

// todo handle errors, particularly 404