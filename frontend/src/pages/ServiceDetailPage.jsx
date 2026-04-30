import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, ArrowRight, Zap, Shield, Cloud, Smartphone, Brain, TrendingUp, RefreshCw } from 'lucide-react';

const serviceDetails = {
  'ai-development': {
    title: 'AI Development & Agents',
    icon: Brain,
    gradient: 'from-blue-500 to-indigo-500',
    description: 'Production-ready AI systems that automate complex workflows',
    longDescription: 'We build production-ready AI systems that go beyond ChatGPT wrappers. Our agents read emails, invoices, contracts and trigger actions across your systems with 99% accuracy. From custom LLM integration to RAG pipelines, we deliver AI solutions that transform your business operations.',
    features: [
      'Agentic AI Solutions - Autonomous agents that perform complex tasks',
      'LLM Integration & RAG Pipelines - Connect LLMs to your private data',
      'AI Enablement Consulting - Strategy to POC in 2 weeks',
      'Intelligent Document Processing - Extract data with 99%+ accuracy'
    ],
    technologies: ['OpenAI GPT-4', 'Claude', 'Llama 3', 'LangChain', 'Vector Databases', 'RAG Pipelines'],
    results: [
      { metric: '85%', label: 'Reduction in manual processing' },
      { metric: '70%', label: 'Faster proposal creation' },
      { metric: '99%', label: 'Document extraction accuracy' }
    ]
  },
  'saas': {
    title: 'Enterprise SaaS',
    icon: Cloud,
    gradient: 'from-cyan-500 to-blue-500',
    description: 'Scalable multi-tenant platforms for enterprise',
    longDescription: 'Build robust SaaS platforms with enterprise-grade security, subscription billing, and infrastructure that scales effortlessly from 10 to 100,000 users. Our multi-tenant architecture ensures isolation and performance.',
    features: [
      'Multi-tenant Architecture - Isolated tenant data',
      'Subscription Management - Flexible billing models',
      'SOC2 Ready - Enterprise-grade security',
      'Analytics Dashboard - Real-time insights'
    ],
    technologies: ['React/Next.js', 'Node.js/Python', 'PostgreSQL', 'Redis', 'Kubernetes'],
    results: [
      { metric: '99.99%', label: 'Uptime guarantee' },
      { metric: '10x', label: 'User growth capacity' },
      { metric: '60%', label: 'Infrastructure cost reduction' }
    ]
  },
  'web-mobile': {
    title: 'Web & Mobile Apps',
    icon: Smartphone,
    gradient: 'from-green-500 to-teal-500',
    description: 'Cross-platform applications with native performance',
    longDescription: 'Create beautiful, performant applications for web, iOS, and Android with a single codebase using modern frameworks like Next.js 15 and Flutter. Offline-first experiences with real-time sync.',
    features: [
      'Cross-Platform Development - One codebase, multiple platforms',
      'Offline-First - Work without internet connection',
      'Biometric Authentication - Face ID, Fingerprint',
      'Real-time Sync - Instant data synchronization'
    ],
    technologies: ['Next.js 15', 'React Native', 'Flutter', 'Swift', 'Kotlin', 'GraphQL'],
    results: [
      { metric: '60fps', label: 'Performance' },
      { metric: '95%', label: 'Code reuse' },
      { metric: '2x', label: 'Faster development' }
    ]
  },
  'legacy': {
    title: 'Legacy Modernization',
    icon: RefreshCw,
    gradient: 'from-orange-500 to-red-500',
    description: 'Zero-downtime migration to modern stack',
    longDescription: 'Modernize your legacy systems without disruption. We migrate incrementally using strangler pattern, keeping your business running 24/7. From .NET/PHP/VB to modern cloud-native architecture.',
    features: [
      'Zero Downtime Migration - Business continuity guaranteed',
      'Modern Stack - Latest technologies and frameworks',
      'Cloud Native - Scalable microservices',
      'API First - RESTful and GraphQL APIs'
    ],
    technologies: ['Docker', 'Kubernetes', 'Microservices', 'Event-Driven Architecture', 'API Gateway'],
    results: [
      { metric: '70%', label: 'Cost reduction' },
      { metric: 'Zero', label: 'Downtime migration' },
      { metric: '5x', label: 'Faster deployments' }
    ]
  },
  'security': {
    title: 'Cybersecurity',
    icon: Shield,
    gradient: 'from-purple-500 to-pink-500',
    description: 'Enterprise-grade security and compliance',
    longDescription: 'Protect your business with enterprise-grade security, compliance audits, and 24/7 threat monitoring. We ensure your systems are always secure with GDPR/PDPA compliance and monthly penetration testing.',
    features: [
      'GDPR/PDPA Compliance - Full regulatory compliance',
      'Monthly Pentests - Regular security assessments',
      '24/7 Monitoring - Real-time threat detection',
      'Incident Response - 15-min SLA for critical issues'
    ],
    technologies: ['WAF', 'IDS/IPS', 'SIEM', 'Encryption', 'Zero Trust Architecture'],
    results: [
      { metric: '99.99%', label: 'Threat prevention' },
      { metric: '15-min', label: 'Incident response SLA' },
      { metric: '100%', label: 'Compliance achieved' }
    ]
  },
  'ai-consulting': {
    title: 'AI Consulting',
    icon: TrendingUp,
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Strategic AI implementation and rapid prototyping',
    longDescription: 'Identify high-ROI automation opportunities and build POCs in 2 weeks. Strategic guidance for AI adoption across your organization including team training and implementation roadmap.',
    features: [
      'AI Strategy - Custom roadmap for your business',
      'Rapid Prototyping - POC in 2 weeks',
      'Workflow Automation - Identify automation opportunities',
      'ROI Analysis - Measure business impact'
    ],
    technologies: ['LLMs', 'Computer Vision', 'Predictive Analytics', 'Process Mining', 'Automation Tools'],
    results: [
      { metric: '2-week', label: 'POC delivery' },
      { metric: '30%', label: 'Efficiency gain' },
      { metric: 'Clear', label: 'AI roadmap' }
    ]
  }
};

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = serviceDetails[serviceId] || serviceDetails['ai-development'];
  const IconComponent = service.icon;

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${service.gradient} text-white py-16`}>
        <div className="container-custom">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> Back to Services
          </button>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
            <p className="text-xl text-white/90">{service.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{service.longDescription}</p>

                <h3 className="text-xl font-bold mb-4">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-4">Technologies We Use</h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="sticky top-24">
                <div className={`bg-gradient-to-r ${service.gradient} rounded-2xl p-6 text-white mb-6`}>
                  <h3 className="text-xl font-bold mb-4">Ready to Get Started?</h3>
                  <p className="text-white/90 mb-6">Let's discuss how our {service.title} can transform your business.</p>
                  <button className="w-full bg-white text-indigo-600 px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
                    Book a Consultation <ArrowRight size={16} />
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold mb-4">Key Results</h3>
                  <div className="space-y-4">
                    {service.results.map((result, idx) => (
                      <div key={idx} className="text-center p-3 bg-indigo-50 dark:bg-indigo-950 rounded-xl">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.metric}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{result.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;