import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, TrendingUp, FileText, Sparkles, Zap, Shield, Cpu, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIDevelopmentPage = () => {
  const offerings = [
    { icon: Cpu, title: 'Agentic AI Solutions', description: 'Autonomous agents that read emails, invoices, contracts → trigger actions across your systems', stat: '85% automation' },
    { icon: Database, title: 'LLM Integration & RAG Pipelines', description: 'Connect LLMs to your private data. Secure, auditable, and domain-specific', stat: '99% accuracy' },
    { icon: TrendingUp, title: 'AI Enablement Consulting', description: 'From strategy to POC in 2 weeks. Identify high-ROI automation opportunities', stat: '2-week POC' },
    { icon: FileText, title: 'Intelligent Document Processing', description: 'Extract data from invoices, contracts, forms with 99%+ accuracy', stat: '99%+ accuracy' },
  ];

  return (
    <div className="pt-0 md:pt-20">
      <section className="bg-gradient-to-r from-[#F59E0B]/90 to-[#FBBF24]/70 text-white py-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h1 className="text-5xl font-bold mb-4">AI Development & Intelligent Agents</h1>
            <p className="text-xl max-w-3xl mx-auto text-indigo-100">Not ChatGPT wrappers. Production-ready AI that automates complex workflows.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Our AI Offerings</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {offerings.map((offering, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all group border border-gray-100 dark:border-gray-700">
                <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <offering.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{offering.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{offering.description}</p>
                <div className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950 rounded-full text-sm text-indigo-600 font-semibold">{offering.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            {[{ value: "85%", label: "Reduction in manual document processing" }, { value: "70%", label: "Faster proposal creation" }, { value: "95%", label: "Patient intake accuracy" }].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }}>
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-indigo-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform with AI?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">Let's discuss how our AI solutions can automate your workflows and drive efficiency.</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">Start Your AI Journey <Zap size={18} /></Link>
        </div>
      </section>
    </div>
  );
};

export default AIDevelopmentPage;