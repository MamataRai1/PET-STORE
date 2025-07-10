import React from 'react';
import { useRoutes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ShopPAge from './pages/ShopPAge';

const routes = [
  {
    path: '/',
    element: <LandingPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'signin', element: <SignInPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'shop', element: <ShopPAge /> },
      
    ],
  },
];

const AppRoutes = () => useRoutes(routes);

export default AppRoutes;
