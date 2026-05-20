// src/pages/ServiceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { servicesAPI } from '../services/api';
import * as Icons from 'lucide-react';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getById(serviceId);
      
      if (response.data?.success) {
        setService(response.data.data);
      } else {
        setError('Service not found');
      }
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const IconComponent = service?.icon ? Icons[service.icon] : Icons.Brain;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <button
            onClick={() => navigate('/services')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.section 
        className={`bg-gradient-to-r from-[#F59E0B]/90 to-[#FBBF24]/70 text-white py-20`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container-custom">
          <motion.button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
            whileHover={{ x: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ArrowLeft className="w-5 h-5" /> Back to Services
          </motion.button>
          
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.div 
              className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            >
              <IconComponent className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              variants={fadeInLeft}
            >
              {service.title}
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90"
              variants={fadeInRight}
            >
              {service.description}
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Content Section */}
      <motion.section 
        className="py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <motion.h2 
                  className="text-2xl font-bold mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  Overview
                </motion.h2>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {service.description}
                </motion.p>

                <motion.h3 
                  className="text-xl font-bold mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  Key Features
                </motion.h3>
                <div className="grid md:grid-cols-2 gap-3 mb-8">
                  {service.features?.map((feature, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-start gap-2 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      </motion.div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.h3 
                  className="text-xl font-bold mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Why Choose Us
                </motion.h3>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Our team of experts delivers enterprise-grade solutions with cutting-edge technology, 
                  ensuring your business stays ahead of the competition. We combine deep industry knowledge 
                  with technical excellence to provide solutions that drive real business value.
                </motion.p>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                variants={fadeInRight}
                className="sticky top-24"
              >
                <motion.div 
                  className={`bg-gradient-to-r ${service.gradient} rounded-2xl p-6 text-white mb-6`}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.h3 
                    className="text-xl font-bold mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    Ready to Get Started?
                  </motion.h3>
                  <motion.p 
                    className="text-white/90 mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    Let's discuss how our {service.title} can transform your business.
                  </motion.p>
                  <motion.button 
                    onClick={() => navigate('/contact')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-indigo-600 px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    Book a Consultation <ArrowRight size={16} />
                  </motion.button>
                </motion.div>

                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.h3 
                    className="text-lg font-bold mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    Service Highlights
                  </motion.h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Expert Team', value: '✓ Dedicated' },
                      { label: 'Support', value: '24/7 Available' },
                      { label: 'Delivery Time', value: '2-4 Weeks' }
                    ].map((item, idx) => (
                      <motion.div 
                        key={idx}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-gray-500">{item.label}</span>
                        <motion.span 
                          className="font-semibold text-gray-700 dark:text-gray-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.value}
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <motion.a 
                      href="/contact" 
                      className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all"
                      whileHover={{ x: 5 }}
                    >
                      Get Custom Quote <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default ServiceDetailPage;