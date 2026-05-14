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
          Trusted by emerging enterprises in USA, UAE, UK & MENA
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
              className="group cursor-pointer"
            >
              {/* Card Style - Professional Look */}
              <div className="bg-white dark:bg-gray-800 px-8 py-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300">
                <span className="text-gray-600 dark:text-gray-300 font-semibold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {logo}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TrustBar;