// src/pages/AIDevelopmentPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiDatabase, FiTrendingUp, FiFileText } from 'react-icons/fi';

const AIDevelopmentPage = () => {
  const offerings = [
    {
      icon: FiCpu,
      title: 'Agentic AI Solutions',
      description: 'Autonomous agents that read emails, invoices, contracts → trigger actions across your systems',
    },
    {
      icon: FiDatabase,
      title: 'LLM Integration & RAG Pipelines',
      description: 'Connect LLMs to your private data. Secure, auditable, and domain-specific',
    },
    {
      icon: FiTrendingUp,
      title: 'AI Enablement Consulting',
      description: 'From strategy to POC in 2 weeks. Identify high-ROI automation opportunities',
    },
    {
      icon: FiFileText,
      title: 'Intelligent Document Processing',
      description: 'Extract data from invoices, contracts, forms with 99%+ accuracy',
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">AI Development & Intelligent Agents</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Not ChatGPT wrappers. Production-ready AI that automates complex workflows.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Our AI Offerings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offerings.map((offering, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <offering.icon className="text-4xl text-accent mb-4" />
                <h3 className="text-xl font-bold mb-3">{offering.title}</h3>
                <p className="text-gray-600">{offering.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Real-world Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">85%</div>
              <p className="text-gray-600">Reduction in manual document processing</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">70%</div>
              <p className="text-gray-600">Faster proposal creation</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">95%</div>
              <p className="text-gray-600">Patient intake accuracy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIDevelopmentPage;