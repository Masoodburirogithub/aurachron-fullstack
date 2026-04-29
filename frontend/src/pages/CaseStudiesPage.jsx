// src/pages/CaseStudiesPage.jsx
import React, { useState, useEffect } from 'react';
import { caseStudiesAPI } from '../services/api';

const CaseStudiesPage = () => {
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await caseStudiesAPI.getAll();
        setCaseStudies(response.data.data);
      } catch (error) {
        console.error('Error fetching case studies:', error);
      }
    };
    fetchCaseStudies();
  }, []);

  const defaultCaseStudies = [
    {
      title: "Gulf Oil — Eliminated 85% of Safety Incident Reporting Time",
      industry: "Oil & Gas",
      technology: "AI Agents, RAG Pipeline",
      challenge: "500+ sites, manual safety reports taking 4+ hours per incident",
      solution: "AI agent with RAG pipeline + mobile-first reporting app",
      result: "85% reduction in reporting time. Real-time dashboards for HQ",
    },
    {
      title: "Real Estate AI — From Minutes to Seconds",
      industry: "PropTech",
      technology: "LLM Integration, RAG",
      challenge: "Proposal creation took 45 minutes per document, inconsistent quality",
      solution: "LLM-based template generator + client data integration",
      result: "70% faster proposal turnaround. 90% client satisfaction",
    },
    {
      title: "Pica — Connecting 150+ Platforms with One SDK",
      industry: "Automation",
      technology: "Agentic Automation SDK",
      challenge: "Fragmented automation across 150+ tools, high maintenance cost",
      solution: "Unified agentic automation SDK + low-code connectors",
      result: "150+ integrations live. 95% reduction in integration bugs",
    },
  ];

  const displayData = caseStudies.length > 0 ? caseStudies : defaultCaseStudies;

  return (
    <div>
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold mb-4">Our Success Stories</h1>
          <p className="text-xl text-gray-600">Real results from real partnerships</p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <div className="space-y-12">
            {displayData.map((study, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="text-sm text-accent font-semibold mb-2">{study.industry}</div>
                  <h2 className="text-2xl font-bold mb-4">{study.title}</h2>
                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <h3 className="font-semibold mb-2">Challenge</h3>
                      <p className="text-gray-600">{study.challenge}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Solution</h3>
                      <p className="text-gray-600">{study.solution}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Result</h3>
                      <p className="text-gray-600">{study.result}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-500">Technology: {study.technology}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudiesPage;