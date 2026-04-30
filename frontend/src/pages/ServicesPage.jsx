import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Cloud, Smartphone, RefreshCw, Shield, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

const services = [
  { id: 'ai-development', icon: Brain, title: 'AI Development & Agents', description: 'Custom AI agents, LLM integrations, RAG pipelines', features: ['Agentic AI Solutions', 'LLM Integration', 'RAG Pipelines', 'AI Enablement'], gradient: 'from-blue-500 to-indigo-500' },
  { id: 'saas', icon: Cloud, title: 'Enterprise SaaS', description: 'Multi-tenant architecture, subscription management', features: ['Multi-tenant', 'Subscription Management', 'SOC2 Ready', 'Analytics'], gradient: 'from-cyan-500 to-blue-500' },
  { id: 'web-mobile', icon: Smartphone, title: 'Web & Mobile Apps', description: 'Next.js 15, Flutter, Swift/Kotlin', features: ['Cross-Platform', 'Offline-First', 'Biometric Auth', 'Real-time Sync'], gradient: 'from-green-500 to-teal-500' },
  { id: 'legacy', icon: RefreshCw, title: 'Legacy Modernization', description: 'Zero downtime migration to modern stack', features: ['Zero Downtime', 'Modern Stack', 'Cloud Native', 'API First'], gradient: 'from-orange-500 to-red-500' },
  { id: 'security', icon: Shield, title: 'Cybersecurity', description: 'PDPA/GDPR readiness, monthly pentests', features: ['GDPR Compliant', 'Monthly Pentests', '24/7 Monitoring', 'Incident Response'], gradient: 'from-purple-500 to-pink-500' },
  { id: 'ai-consulting', icon: TrendingUp, title: 'AI Consulting', description: 'Strategy + rapid prototyping', features: ['AI Strategy', 'Rapid Prototyping', 'Workflow Automation', 'ROI Analysis'], gradient: 'from-yellow-500 to-orange-500' },
];

const ServicesPage = () => {
  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-gray-900 to-indigo-900 text-white py-20">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold mb-4">
            Our Services
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our full range of AI-augmented services designed to accelerate your digital transformation
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 group"
              >
                <div className={`h-1 bg-gradient-to-r ${service.gradient}`} />
                <div className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.gradient} p-0.5 mb-5`}>
                    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">{service.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                  <div className="space-y-2 mb-5">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-indigo-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={`/services/${service.id}`} className="inline-flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;