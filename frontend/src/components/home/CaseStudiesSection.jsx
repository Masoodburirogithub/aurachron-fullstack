// src/components/home/CaseStudiesSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CaseStudiesSection = ({ caseStudies }) => {
  const defaultCaseStudies = [
    {
      id: 1,
      title: 'Logistics AI — Karachi Port',
      result: 'Eliminated 85% of manual documentation time across 150+ freight forwarders',
      technology: 'LLM-based exception handling',
      industry: 'Oil & Gas / Logistics',
    },
    {
      id: 2,
      title: 'Real Estate Proposal AI',
      result: 'From 45 minutes → 90 seconds (70% faster close rate)',
      technology: 'RAG pipelines + LLM template generator',
      industry: 'PropTech',
    },
    {
      id: 3,
      title: 'Agentic Workflow for Pica',
      result: 'Connected 10+ platforms with one unified SDK',
      technology: 'Agentic automation SDK',
      industry: 'Automation / Integration',
    },
  ];

  const displayData = caseStudies.length > 0 ? caseStudies : defaultCaseStudies;

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Prime Projects & Outcomes</h2>
          <p className="text-xl text-gray-600">
            Real results from real partnerships
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayData.map((study, index) => (
            <motion.div
              key={study.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card bg-gradient-to-br from-white to-gray-50"
            >
              <div className="text-sm text-accent font-semibold mb-2">{study.industry}</div>
              <h3 className="text-xl font-bold mb-3">{study.title}</h3>
              <p className="text-gray-700 mb-3">{study.result}</p>
              <div className="text-sm text-gray-500">
                <span className="font-semibold">Tech:</span> {study.technology}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/case-studies" className="btn-secondary">
            View All Case Studies →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;