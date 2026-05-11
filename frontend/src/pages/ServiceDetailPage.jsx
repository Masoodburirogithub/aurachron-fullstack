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

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getById(serviceId);
      // console.log('Service details:', response.data);
      
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

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
          {/* <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div> */}
          {/* <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2> */}
          {/* <p className="text-gray-600 mb-6">{error || 'The service you are looking for does not exist.'}</p> */}
          {/* <button
            onClick={() => navigate('/services')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Services
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${service.gradient} text-white py-20`}>
        <div className="container-custom">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Services
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
            <p className="text-xl text-white/90">{service.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  {service.description}
                </p>

                <h3 className="text-xl font-bold mb-4">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-3 mb-8">
                  {service.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-4">Why Choose Us</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our team of experts delivers enterprise-grade solutions with cutting-edge technology, 
                  ensuring your business stays ahead of the competition. We combine deep industry knowledge 
                  with technical excellence to provide solutions that drive real business value.
                </p>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-24"
              >
                <div className={`bg-gradient-to-r ${service.gradient} rounded-2xl p-6 text-white mb-6`}>
                  <h3 className="text-xl font-bold mb-4">Ready to Get Started?</h3>
                  <p className="text-white/90 mb-6">Let's discuss how our {service.title} can transform your business.</p>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="w-full bg-white text-indigo-600 px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    Book a Consultation <ArrowRight size={16} />
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold mb-4">Service Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Expert Team</span>
                      <span className="font-semibold">✓ Dedicated</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Support</span>
                      <span className="font-semibold">24/7 Available</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Delivery Time</span>
                      <span className="font-semibold">2-4 Weeks</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <a 
                      href="/contact" 
                      className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all"
                    >
                      Get Custom Quote <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;