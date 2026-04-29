// src/components/common/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      <div className="container-custom text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Ship Production-Ready Systems at{' '}
          <span className="gradient-text">AI Speed</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
        >
          We combine deep systems engineering with AI-native delivery to build scalable, 
          secure applications in half the time. Zero technical debt. Full IP ownership.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link to="/contact" className="btn-primary">
            Launch Your Project →
          </Link>
          <Link to="/services/ai-development" className="btn-secondary">
            Explore AI Edge
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-accent">10+</div>
            <div className="text-gray-600">Projects Delivered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">&lt;2 weeks</div>
            <div className="text-gray-600">Avg. MVP to Live</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent">100%</div>
            <div className="text-gray-600">IP Ownership</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;