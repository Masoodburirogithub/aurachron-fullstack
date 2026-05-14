// src/pages/ServicesPage.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import {
  Brain,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

import * as Icons from 'lucide-react';

import {
  servicesAPI,
  pageSettingsAPI
} from '../services/api';

const ServicesPage = () => {

  // STATES
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [pageSettings, setPageSettings] = useState({
    title: 'Our Services',
    subtitle:
      'Explore our full range of AI-augmented services designed to accelerate your digital transformation',
    badgeText: 'What We Do'
  });

  // FETCH DATA
  useEffect(() => {

    fetchServices();
    fetchPageSettings();

  }, []);

  // FETCH SERVICES
  const fetchServices = async () => {

    try {

      setLoading(true);

      const response = await servicesAPI.getAll();

      if (response.data?.success) {

        setServices(
          response.data.data.filter(
            (service) => service.isActive !== false
          )
        );

      } else if (Array.isArray(response.data)) {

        setServices(
          response.data.filter(
            (service) => service.isActive !== false
          )
        );

      } else {

        setServices([]);

      }

    } catch (error) {

      console.error('Error fetching services:', error);

      setServices([]);

    } finally {

      setLoading(false);

    }
  };

  // FETCH PAGE SETTINGS
  const fetchPageSettings = async () => {

    try {

      const response = await pageSettingsAPI.getSettings(
        'services',
        'hero'
      );

      if (
        response.data?.success &&
        response.data.data
      ) {

        setPageSettings({
          title:
            response.data.data.title ||
            'Our Services',

          subtitle:
            response.data.data.subtitle ||
            'Explore our full range of AI-augmented services designed to accelerate your digital transformation',

          badgeText:
            response.data.data.metadata?.badgeText ||
            'What We Do'
        });
      }

    } catch (error) {

      console.error(
        'Error fetching page settings:',
        error
      );

    }
  };

  // GET ICON COMPONENT
  const getIconComponent = (iconName) => {

    return Icons[iconName] || Brain;
  };

  // LOADING SCREEN
  if (loading) {

    return (

      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600 dark:text-gray-300">
            Loading services...
          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="pt-0 md:pt-20 ">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] text-white py-20">

        <div className="container-custom text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 mb-5 backdrop-blur-sm border border-white/10">

              <Sparkles className="w-4 h-4 text-indigo-400" />

              <span className="text-sm text-indigo-200 font-medium">
                {pageSettings.badgeText}
              </span>

            </div>

            {/* TITLE */}
            <h1 className="text-3xl md:text-5xl font-bold">

              {pageSettings.title}

            </h1>

            {/* SUBTITLE */}
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">

              {pageSettings.subtitle}

            </p>

          </motion.div>

        </div>

      </section>

      {/* SERVICES GRID */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">

        <div className="container-custom">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {services.map((service, idx) => {

              const IconComponent =
                getIconComponent(service.icon);

              const features =
                service.features || ['Coming Soon'];

              return (

                <motion.div
                  key={service.id || idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.1,
                    duration: 0.5
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                >

                  {/* TOP GRADIENT BAR */}
                  <div
                    className={`h-1 bg-gradient-to-r ${
                      service.gradient ||
                      'from-indigo-500 to-purple-500'
                    }`}
                  />

                  <div className="p-6">

                    {/* ICON */}
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${
                        service.gradient ||
                        'from-indigo-500 to-purple-500'
                      } p-0.5 mb-5 transition-transform duration-300 group-hover:scale-110`}
                    >

                      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center">

                        <IconComponent className="w-6 h-6 text-indigo-600" />

                      </div>

                    </div>

                    {/* TITLE */}
                    <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">

                      {service.title}

                    </h2>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">

                      {service.description}

                    </p>

                    {/* FEATURES */}
                    <div className="space-y-3 mb-6">

                      {features.slice(0, 4).map((feature, i) => (

                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >

                          <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />

                          <span>
                            {feature}
                          </span>

                        </div>

                      ))}

                    </div>

                    {/* LEARN MORE */}
                    <Link
                      to={`/services/${service.id}`}
                      className="inline-flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all"
                    >

                      Learn More

                      <ArrowRight className="w-4 h-4" />

                    </Link>

                  </div>

                </motion.div>
              );
            })}

          </div>

        </div>

      </section>

    </div>
  );
};

export default ServicesPage;