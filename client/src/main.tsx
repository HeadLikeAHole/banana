import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import { store } from './store.ts'
import Router from './Router.tsx';
import { fetchUser } from './features/auth/authSlice.ts';

function start() {
  store.dispatch(fetchUser())

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <Router />
      </Provider>
    </React.StrictMode>
  );
}

start();