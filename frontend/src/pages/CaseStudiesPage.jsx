import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, TrendingUp, Award, Clock } from 'lucide-react';

const caseStudies = [
  {
    id: 1,
    title: "Gulf Oil — Eliminated 85% of Safety Incident Reporting Time",
    industry: "Oil & Gas",
    technology: "AI Agents, RAG Pipeline",
    challenge: "500+ sites, manual safety reports taking 4+ hours per incident",
    solution: "AI agent with RAG pipeline + mobile-first reporting app",
    result: "85% reduction in reporting time. Real-time dashboards for HQ",
    metric: "4 hours → 30 minutes",
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800",
    tags: ["AI Agents", "RAG Pipeline", "Mobile App"]
  },
  {
    id: 2,
    title: "Real Estate AI — From Minutes to Seconds",
    industry: "PropTech",
    technology: "LLM Integration, RAG",
    challenge: "Proposal creation took 45 minutes per document, inconsistent quality",
    solution: "LLM-based template generator + client data integration",
    result: "70% faster proposal turnaround. 90% client satisfaction",
    metric: "45 minutes → 15 seconds",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    tags: ["LLM", "RAG", "Template Engine"]
  },
  {
    id: 3,
    title: "Pica — Connecting 150+ Platforms with One SDK",
    industry: "Automation",
    technology: "Agentic Automation SDK",
    challenge: "Fragmented automation across 150+ tools, high maintenance cost",
    solution: "Unified agentic automation SDK + low-code connectors",
    result: "150+ integrations live. 95% reduction in integration bugs",
    metric: "95% fewer bugs",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    tags: ["Automation SDK", "Agentic AI", "Low-Code"]
  }
];

const CaseStudiesPage = () => {
  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 py-20">
        <div className="container-custom text-center text-white">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            Our Success Stories
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-indigo-100">
            Real results from real partnerships
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="space-y-12">
            {caseStudies.map((study, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="h-64 md:h-auto overflow-hidden">
                    <img src={study.image} alt={study.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{study.industry}</span>
                      <span className="text-gray-300">•</span>
                      <div className="flex gap-1">
                        {study.tags.map((tag, i) => (
                          <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{study.title}</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Challenge</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{study.challenge}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Solution</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{study.solution}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Result</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{study.result}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="text-2xl font-bold text-indigo-600">{study.metric}</div>
                        <span className="text-sm text-gray-500">Technology: {study.technology}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudiesPage;