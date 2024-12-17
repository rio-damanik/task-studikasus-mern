import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Auth from './components/Auth/Auth';
import ProductManagement from './components/Admin/ProductManagement';
import Cart from './components/Cart/Cart';
import UserProfile from './components/UserProfile/UserProfile';
import PrivateRoute from './components/PrivateRoute';
import Products from './components/Product/Products';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Products />
      },
      {
        path: '/auth',
        element: <Auth />
      },
      {
        path: '/admin/products',
        element: (
          <PrivateRoute requiredRole="admin">
            <ProductManagement />
          </PrivateRoute>
        )
      },
      {
        path: '/cart',
        element: (
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        )
      },
      {
        path: '/profile',
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        )
      }
    ]
  }
]);

export default router;
