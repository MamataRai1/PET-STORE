import React from 'react';
import { useRoutes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ShopPAge from './pages/ShopPAge';
import ProductPage from './components/ProductCard';


const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'signin',
        element: <SignInPage />
      },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'shop', element: <ShopPAge /> },
      { path: 'product/:id', element: <ProductPage /> },  // Add this route
       

    ],
  },
];

const AppRoutes = () => useRoutes(routes);

export default AppRoutes;
