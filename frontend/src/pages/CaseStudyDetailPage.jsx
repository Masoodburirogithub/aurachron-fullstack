import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, TrendingUp, Shield, Zap, Users } from 'lucide-react';

const caseStudyData = {
  1: {
    title: "Gulf Oil — Eliminated 85% of Safety Incident Reporting Time",
    industry: "Oil & Gas",
    client: "Gulf Oil International",
    duration: "3 months",
    team: "5 Engineers",
    challenge: "Managing safety incidents across 500+ sites with manual paper-based reporting taking 4+ hours per incident, leading to delayed responses and incomplete data.",
    solution: "We built an AI-powered safety reporting system with computer vision for automatic incident detection, RAG pipeline for regulatory compliance, and mobile-first app for field workers.",
    results: [
      "85% reduction in reporting time (from 4 hours to 30 minutes)",
      "Real-time dashboards for HQ with live incident tracking",
      "100% compliance with safety regulations",
      "500+ sites connected in unified system"
    ],
    technologies: ["React Native", "Python FastAPI", "OpenAI GPT-4", "LangChain", "PostgreSQL", "AWS"],
    testimonial: "Aurachron transformed our safety reporting process. What used to take half a day now takes 30 minutes. The AI detection is incredibly accurate."
  },
  2: {
    title: "Real Estate AI — From Minutes to Seconds",
    industry: "PropTech",
    client: "Leading Real Estate Agency",
    duration: "2 months",
    team: "3 Engineers",
    challenge: "Proposal creation was taking 45 minutes per document with inconsistent quality and formatting issues across the team.",
    solution: "LLM-based proposal generation system that pulls client data, property details, and market analysis to create professional proposals in seconds.",
    results: [
      "70% faster proposal turnaround (45 min → 15 seconds)",
      "90% client satisfaction rate",
      "Consistent branding and formatting",
      "50+ proposals generated per week"
    ],
    technologies: ["Next.js", "OpenAI API", "Pinecone", "PostgreSQL", "TailwindCSS"],
    testimonial: "Our sales team can now focus on selling instead of formatting documents. The AI-generated proposals are better than what we created manually."
  },
  3: {
    title: "Pica — Connecting 150+ Platforms with One SDK",
    industry: "Automation",
    client: "Pica Automation",
    duration: "6 months",
    team: "8 Engineers",
    challenge: "Fragmented automation across 150+ enterprise tools led to high maintenance costs and integration bugs.",
    solution: "Unified agentic automation SDK that provides a single interface for all integrations with low-code connectors and event-driven architecture.",
    results: [
      "150+ integrations live within 6 months",
      "95% reduction in integration bugs",
      "70% faster development time",
      "Used by 50+ enterprise customers"
    ],
    technologies: ["TypeScript", "Node.js", "Kafka", "Redis", "Docker", "Kubernetes"],
    testimonial: "Aurachron delivered a game-changing solution. Our customers love the simplicity of a single SDK for all their automation needs."
  }
};

const CaseStudyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = caseStudyData[id] || caseStudyData[1];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container-custom">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> Back to Case Studies
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
          <div className="flex flex-wrap gap-4 text-indigo-100">
            <span>{data.industry}</span>
            <span>•</span>
            <span>{data.client}</span>
            <span>•</span>
            <span>{data.duration}</span>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{data.challenge}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{data.solution}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Key Results</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.results.map((result, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-8 border-l-4 border-indigo-600">
                <p className="text-lg italic text-gray-700 dark:text-gray-300">"{data.testimonial}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Client Testimonial</p>
                    <p className="text-sm text-gray-500">{data.client}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Client</span>
                      <span className="font-semibold">{data.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-semibold">{data.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Team Size</span>
                      <span className="font-semibold">{data.team}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.technologies.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
                  Request Similar Solution →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetailPage;