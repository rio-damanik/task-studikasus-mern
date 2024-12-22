import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Auth from './components/Auth/Auth';
import ProductManagement from './components/Admin/ProductManagement';
import Order from './components/Order/Order';
import Invoice from './components/Invoice/Invoice';
import Products from './components/Product/Products';
import UserProfile from './components/UserProfile/UserProfile';
import PrivateRoute from './components/PrivateRoute';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: <Products />,
        },
        {
          path: 'auth',
          element: <Auth />,
        },
        {
          path: 'admin/products',
          element: (
            <PrivateRoute requiredRole="admin">
              <ProductManagement />
            </PrivateRoute>
          ),
        },
        {
          path: 'order',
          element: (
            <PrivateRoute>
              <Order />
            </PrivateRoute>
          ),
        },
        {
          path: 'invoice/:orderId',
          element: (
            <PrivateRoute>
              <Invoice />
            </PrivateRoute>
          ),
        },
        {
          path: 'profile',
          element: (
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
