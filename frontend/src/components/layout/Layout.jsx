import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
// import Chatbot from '../common/Chatbot';

import RagChatbot from '../common/RagChatbot';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className={`flex-grow ${!isHomePage ? 'pt-20' : ''}`}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
       <RagChatbot /> 
      {/* <Chatbot /> */}
    </div>
  );
};

export default Layout;