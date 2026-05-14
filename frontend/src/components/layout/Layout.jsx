// src/components/layout/Layout.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import RagChatbot from '../common/RagChatbot';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // ✅ Add this effect to scroll to top on route change
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }} // Reduced for faster transition
          className={`flex-grow ${!isHomePage ? 'pt-20' : ''}`}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <RagChatbot />
    </div>
  );
};

export default Layout;