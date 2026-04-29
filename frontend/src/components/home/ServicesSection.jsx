// src/components/home/ServicesSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCpu, FiCloud, FiSmartphone, FiRefreshCw, FiShield, FiTrendingUp } from 'react-icons/fi';

const services = [
  {
    icon: FiCpu,
    title: 'AI Development & Agents',
    description: 'Custom LLM agents, RAG pipelines, intelligent document processing — from strategy to production',
    path: '/services/ai-development',
  },
  {
    icon: FiCloud,
    title: 'Enterprise SaaS Platforms',
    description: 'Multi-tenant architecture, subscription mgmt, SOC2-ready logging. Scales 10 → 100k users',
    path: '/services/saas',
  },
  {
    icon: FiSmartphone,
    title: 'Modern Web & Mobile Apps',
    description: 'Next.js 15, Flutter, Swift/Kotlin. Passkeys, biometric, offline-first experiences',
    path: '/services/web-mobile',
  },
  {
    icon: FiRefreshCw,
    title: 'Legacy Modernization',
    description: 'From .NET/PHP/VB to modern stack — zero downtime, side-by-side migration',
    path: '/services/legacy',
  },
  {
    icon: FiShield,
    title: 'Cybersecurity & Compliance',
    description: 'PDPA/GDPR readiness, monthly pentests, 15-min incident SLA',
    path: '/services/security',
  },
  {
    icon: FiTrendingUp,
    title: 'AI Enablement Consulting',
    description: 'Strategy + rapid prototyping to embed AI into existing workflows',
    path: '/services/ai-consulting',
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">AI-Augmented Engineering Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Leverage cutting-edge AI to accelerate your digital transformation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card group hover:shadow-2xl"
            >
              <service.icon className="text-4xl text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link to={service.path} className="text-accent font-semibold hover:underline">
                Learn more →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;