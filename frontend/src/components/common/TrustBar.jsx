// src/components/common/TrustBar.jsx
import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  'Tech Corp', 'Innovate Labs', 'Future Systems', 
  'Digital Vision', 'Smart Solutions', 'Global Tech',
  'Apex Industries', 'Nexus Innovations', 'Quantum Systems'
];

const TrustBar = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 border-y border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="container-custom">
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
          Trusted by emerging enterprises in Pakistan, UAE & KSA
        </p>
      </div>
      
      <div className="relative overflow-hidden">
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 items-center whitespace-nowrap"
        >
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1, color: '#4f46e5' }}
              className="text-gray-400 dark:text-gray-600 font-semibold text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-all px-6 cursor-pointer"
            >
              {logo}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TrustBar;