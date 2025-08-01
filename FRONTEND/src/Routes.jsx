import React from 'react';
import { useRoutes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ShopPAge from './pages/ShopPAge';
import ProductPage from './components/ProductCard';
import LandingPages from './page/LandingPages';
import PrivateRoute from './PrivateRoute';
import AdminPanel from './admin/admin-panel';


const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {  path: 'login',element: <SignInPage /> },
      { path: 'signin', element: <SignUpPage /> },
      { path: 'shop', element: <ShopPAge /> },
      { path: 'product/:id', element: <ProductPage /> },


      { path: 'customer-dashboard', element: <PrivateRoute />
        , children: [
          { index: true, element: <LandingPages /> },
          // Add more private routes here if needed
        ],
      }, 
       {
        path: 'admin-dashboard',
        element: <PrivateRoute />,
        children: [
          { index: true, element: <AdminPanel/> },
        ], 
        },
    ],
  },
];

const AppRoutes = () => useRoutes(routes);

export default AppRoutes;
