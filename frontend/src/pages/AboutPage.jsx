import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Shield, Globe, Heart, Clock, Zap, Award, Users, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  const values = [
    { icon: Target, title: "Radical Ownership", description: "Take full responsibility for outcomes" },
    { icon: Shield, title: "Boring Reliability", description: "Systems that just work, every time" },
    { icon: Globe, title: "Karachi First, Global Always", description: "World-class from Pakistan" },
    { icon: Heart, title: "Learn in Public", description: "Share knowledge, grow together" },
    { icon: Clock, title: "Time Respect", description: "Value everyone's time equally" },
    { icon: Zap, title: "AI-Native", description: "AI-first approach to everything" },
  ];

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold mb-4">
            About Aurachron Systems
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl max-w-3xl mx-auto text-indigo-100">
            We build software that outlasts trends and creates high-impact tech careers in Pakistan
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                To build software that outlasts trends and creates <span className="gradient-text">high-impact</span> tech careers in Pakistan.
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                We're on a mission to prove that world-class software engineering can come from Karachi. 
                Through radical transparency, AI-native workflows, and a commitment to zero technical debt, 
                we're building systems that stand the test of time.
              </p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="text-indigo-600" /> Vision 2030
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                The most respected systems engineering firm from Pakistan — known for zero-downtime and transparent partnerships.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600">50+</div>
                  <div className="text-sm text-gray-500">Projects Delivered</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600">100%</div>
                  <div className="text-sm text-gray-500">Client Satisfaction</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">These principles guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;