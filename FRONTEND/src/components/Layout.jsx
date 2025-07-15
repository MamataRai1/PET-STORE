import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />   {/* This renders your /signin, /shop, / */}
      <Footer />
    </>
  );
};

export default Layout;
