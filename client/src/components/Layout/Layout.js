import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';

const Layout = ({ 
  title = 'Ecommerce app - shop now', 
  description = 'mern stack project', 
  keywords = 'mern,react,node,mongodb', 
  author = 'Digvijaysinh', 
  children // <-- This should be destructured too
}) => {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='description' content={description} />
        <meta name='keyword' content={keywords} /> {/* Corrected keyword to use 'keywords' */}
        <meta name='author' content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "85vh" }} role="main">
        <ToastContainer />
        {children} {/* This will render the children */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
