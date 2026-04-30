// components/home/StatsSection.jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

const stats = [
  { value: 50, label: 'Projects Delivered', suffix: '+', icon: '🚀' },
  { value: 98, label: 'Client Satisfaction', suffix: '%', icon: '⭐' },
  { value: 24, label: 'Hour Support', suffix: '/7', icon: '🕒' },
  { value: 15, label: 'Expert Engineers', suffix: '+', icon: '👥' },
];

const StatCard = ({ stat, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useCountUp(isInView ? stat.value : 0, stat.value, 2000);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="text-4xl mb-3">{stat.icon}</div>
      <div className="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
        {count}{stat.suffix}
      </div>
      <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
    </motion.div>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;